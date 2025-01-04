import hashlib

from collections.abc import Sequence
from typing import Any

import bcrypt

from sqlalchemy import Row, func
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
from app.core.schemas.user_out import UserOut
from app.core.schemas.user_register import UserRegister
from app.database import database_manager

db = database_manager


class QueryingUtils:
	@staticmethod
	def get_default_role_id(session: Session) -> str:
		if default_role := session.exec(select(Role).where(Role.role == RoleType.USER)).first():
			return default_role.id
		else:  # pragma: no cover
			raise ValueError("Default role not found")

	@staticmethod
	def register(user: UserRegister, ip: str) -> str:
		with db.get_session() as session:
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
			except Exception as _:  # pragma: no cover
				raise UserCreationError from None

			return new_session.id

	@staticmethod
	def login(user_req: UserLogin, ip: str) -> str:
		with db.get_session() as session:
			auth = session.exec(select(Auth).where(Auth.email == user_req.email)).first()

			if not auth or not bcrypt.checkpw(
				user_req.password.encode("utf-8"), auth.password.encode("utf-8")
			):
				raise InvalidCredentialsError

			user = session.exec(select(User).where(User.auth_id == auth.id)).first()

			if not user:  # pragma: no cover
				raise UserNotFoundError

			new_session: SessionModel = SessionModel(user_id=user.id, device_ip=ip)

			session.add(new_session)
			session.commit()

			return new_session.id

	@staticmethod
	def logout(session_id: str) -> None:
		with db.get_session() as session:
			if user_session := session.exec(
				select(SessionModel).where(SessionModel.id == session_id)
			).first():
				session.delete(user_session)
			else:
				return

	@staticmethod
	def get_user_info(session_id: str) -> UserOut:
		with db.get_session() as session:
			session_data = session.exec(
				select(SessionModel).where(SessionModel.id == session_id)
			).first()
			if not session_data:
				raise UserNotFoundError

			user = session.exec(select(User).where(User.id == session_data.user_id)).first()
			if not user:
				raise UserNotFoundError

			if auth := session.exec(select(Auth).where(Auth.id == user.auth_id)).first():
				return UserOut(
					first_name=user.name,
					last_name=user.last_name,
					hashed_email=hashlib.sha256(auth.email.encode()).hexdigest(),
					balance=user.balance,
				)
			else:
				raise UserNotFoundError

	@staticmethod
	def get_stocks() -> list[dict[Any, Any]]:
		with db.get_session() as session:
			results = session.exec(select(Company)).all()
			result = [dict(row) for row in results]

		return result

	@staticmethod
	async def insert_prices(stocks_price_tuple: list[tuple[str, tuple[float, float]]]) -> None:
		with db.get_session() as session:
			for stock in stocks_price_tuple:
				stock_history = StockHistory(
					company_id=stock[0], buy=float(stock[1][0]), sell=float(stock[1][1])
				)
				session.add(stock_history)

	@staticmethod
	def get_newest_price_for_all_stocks() -> dict[str, dict[str, float]]:
		with db.get_session() as session:
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

			stock_prices: Any = session.execute(stock_prices_query).all()

			return {stock.ticker: {"buy": stock.buy, "sell": stock.sell} for stock in stock_prices}

	@staticmethod
	def get_stock_details(
		session: Session,
		tickers: list[str],
		industry: str | None = None,
		exchange: str | None = None,
		limit: int = 50,
		page: int = 1,
	) -> Sequence[Row[Any]]:
		query = (
			select(Company, Industry, Exchange)
			.join(Industry, Industry.id == Company.industry_id)  # type: ignore[arg-type]
			.join(Exchange, Exchange.id == Company.exchange_id)  # type: ignore[arg-type]
			.where(Company.ticker.in_(tickers))  # type: ignore[attr-defined]
		)

		if industry:
			query = query.where(Industry.name == industry)

		if exchange:
			query = query.where(Exchange.name == exchange)

		query = query.limit(limit).offset((page - 1) * limit)

		return list(session.execute(query).all())
