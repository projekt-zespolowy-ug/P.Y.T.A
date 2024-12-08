from collections.abc import Sequence
from typing import Any

import bcrypt

from sqlalchemy import func
from sqlmodel import Session, and_, select

from app.core.exceptions import (
	EmailAlreadyExistsError,
	InvalidCredentialsError,
	UserCreationError,
	UserNotFoundError,
)
from app.core.models.auth import Auth
from app.core.models.company import Company
from app.core.models.exchange import Exchange
from app.core.models.industry import Industry
from app.core.models.role import Role, RoleType
from app.core.models.session import Session as SessionModel
from app.core.models.stock_history import StockHistory
from app.core.models.user import User
from app.core.schemas.user_login import UserLogin
from app.core.schemas.user_register import UserRegister
from app.database import engine


class QueryingUtils:
	@staticmethod
	def get_default_role_id(session: Session) -> str:
		if default_role := session.exec(select(Role).where(Role.role == RoleType.USER)).first():
			return default_role.id
		else:
			raise ValueError("Default role not found")

	@staticmethod
	def register(user: UserRegister, ip: str) -> str:
		with Session(engine) as session:
			if session.exec(select(Auth).where(Auth.email == user.email)).first():
				raise EmailAlreadyExistsError

			new_auth = Auth(
				email=user.email,
				password=user.password,
				role_id=QueryingUtils.get_default_role_id(session),
			)
			session.add(new_auth)

			new_user = User(
				name=user.name,
				last_name=user.last_name,
				date_of_birth=user.date_of_birth,
				auth_id=new_auth.id,
			)
			session.add(new_user)

			session.flush()

			new_session: SessionModel = SessionModel(user_id=new_user.id, device_ip=ip)

			session.add(new_session)

			try:
				session.commit()
			except Exception as _:
				raise UserCreationError from None

			return new_session.id

	@staticmethod
	def login(user_req: UserLogin, ip: str) -> str:
		with Session(engine) as session:
			auth = session.exec(select(Auth).where(Auth.email == user_req.email)).first()

			if not auth or not bcrypt.checkpw(
				user_req.password.encode("utf-8"), auth.password.encode("utf-8")
			):
				raise InvalidCredentialsError

			user = session.exec(select(User).where(User.auth_id == auth.id)).first()

			if not user:
				raise UserNotFoundError

			new_session: SessionModel = SessionModel(user_id=user.id, device_ip=ip)

			session.add(new_session)
			session.commit()

			return new_session.id

	@staticmethod
	def logout(session_id: str) -> None:
		with Session(engine) as session:
			user_session = session.exec(select(SessionModel).where(SessionModel.id == session_id))
			if not user_session:
				return
			session.delete(user_session)
			session.commit()

	@staticmethod
	def get_stocks() -> Sequence[Company]:
		with Session(engine) as session:
			return session.exec(select(Company)).all()

	@staticmethod
	async def insert_prices(stocks_price_tuple: list[tuple[str, tuple[float, float]]]) -> None:
		with Session(engine) as session:
			for stock in stocks_price_tuple:
				stock_history = StockHistory(
					company_id=stock[0], buy=float(stock[1][0]), sell=float(stock[1][1])
				)
				session.add(stock_history)
			session.commit()

	@staticmethod
	def get_newest_price_for_all_stocks() -> dict[str, dict[str, float]]:
		with Session(engine) as session:
			subquery = (
				select(
					StockHistory.company_id, func.max(StockHistory.timestamp).label("max_timestamp")
				)
				.group_by(StockHistory.company_id)
				.subquery()
			)

			stock_prices_query = (
				select(Company.ticker, StockHistory.buy, StockHistory.sell)
				.join(StockHistory, StockHistory.company_id == Company.id)  # type: ignore[arg-type]
				.join(
					subquery,
					and_(
						subquery.c.company_id == StockHistory.company_id,
						subquery.c.max_timestamp == StockHistory.timestamp,
					),
				)
			)

			stock_prices: Any = session.exec(stock_prices_query).all()

			return {stock.ticker: {"buy": stock.buy, "sell": stock.sell} for stock in stock_prices}

	@staticmethod
	def get_stock_details(
		tickers: list[str],
		industry: str | None = None,
		exchange: str | None = None,
		limit: int = 50,
		page: int = 1,
	) -> Sequence[Company, Industry, Exchange]:
		with Session(engine) as session:
			query = (
				select(Company, Industry, Exchange)
				.join(Industry, Industry.id == Company.industry_id)
				.join(Exchange, Exchange.id == Company.exchange_id)
				.where(Company.ticker.in_(tickers))
			)

			if industry is not None:
				query = query.where(Industry.name == industry)

			if exchange is not None:
				query = query.where(Exchange.name == exchange)

			query = query.limit(limit).offset((page - 1) * limit)

			return session.exec(query).all()
