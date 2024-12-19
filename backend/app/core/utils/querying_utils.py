import hashlib

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
from app.core.models.role import Role, RoleType
from app.core.models.session import Session as SessionModel
from app.core.models.stock_history import StockHistory
from app.core.models.user import User
from app.core.schemas.user_login import UserLogin
from app.core.schemas.user_out import UserOut
from app.core.schemas.user_register import UserRegister
from app.database import engine


class QueryingUtils:
	@staticmethod
	def get_default_role_id(session: Session) -> str:
		default_role = session.exec(select(Role).where(Role.role == RoleType.USER)).first()
		if not default_role:
			raise ValueError("Default role not found")
		return default_role.id

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
	def get_user_info(session_id: str) -> UserOut:
		with Session(engine) as session:
			session_data = session.exec(
				select(SessionModel).where(SessionModel.id == session_id)
			).first()
			if not session_data:
				raise UserNotFoundError

			user = session.exec(select(User).where(User.id == session_data.user_id)).first()
			if not user:
				raise UserNotFoundError

			auth = session.exec(select(Auth).where(Auth.id == user.auth_id)).first()
			if not auth:
				raise UserNotFoundError

			user_out = UserOut(
				first_name=user.name,
				last_name=user.last_name,
				hashed_email=hashlib.sha256(auth.email.encode()).hexdigest(),
				balance=user.balance,
			)

			return user_out

	@staticmethod
	def get_stocks() -> Sequence[Company]:
		with Session(engine) as session:
			stocks = session.exec(select(Company)).all()
			return stocks

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
