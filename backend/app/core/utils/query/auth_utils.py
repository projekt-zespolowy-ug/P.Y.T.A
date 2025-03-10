import bcrypt

from sqlmodel import Session, select

from app.core.exceptions import (
	EmailAlreadyExistsError,
	InvalidCredentialsError,
	UserCreationError,
	UserNotFoundError,
)
from app.core.models.auth import Auth
from app.core.models.role import Role, RoleType
from app.core.models.session import Session as SessionModel
from app.core.models.user import User
from app.core.schemas.user_login import UserLogin
from app.core.schemas.user_register import UserRegister
from app.database import database_manager

db = database_manager


class AuthUtils:
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
				role_id=AuthUtils.get_default_role_id(session),
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
