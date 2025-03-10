import hashlib

from typing import Any

from sqlmodel import Session, select, update

from app.core.exceptions import (
	UserNotFoundError,
)
from app.core.models.auth import Auth
from app.core.models.session import Session as SessionModel
from app.core.models.user import User
from app.core.schemas.user_out import UserOut
from app.database import database_manager

db = database_manager


class UserUtils:
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
	def get_user_from_token(session: Session, session_id: str) -> dict[str, Any] | None:
		user = session.exec(
			select(User)
			.where(SessionModel.id == session_id)
			.join(SessionModel, SessionModel.user_id == User.id)  # type: ignore[arg-type]
		).first()

		return dict(user) if user else None

	@staticmethod
	def get_user_balance(session: Session) -> float:
		if balance := session.exec(select(User.balance).first()):  # type: ignore[attr-defined]
			return balance  # type: ignore[return-value]
		else:
			raise UserNotFoundError

	@staticmethod
	def update_user_balance(session: Session, user_id: str, change: float) -> None:
		session.execute(
			update(User).where(User.id == user_id).values(balance=User.balance + change)  # type: ignore[arg-type]
		)
