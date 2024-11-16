from sqlmodel import Session, select

from app.core.exceptions import EmailAlreadyExistsError, UserCreationError
from app.core.models.auth import Auth
from app.core.models.role import Role, RoleType
from app.core.models.session import Session as SessionModel
from app.core.models.user import User
from app.core.schemas.user_register import UserRegister
from app.database import engine


class QueryingUtils:
	@staticmethod
	def get_default_role_id() -> str:
		with Session(engine) as session:
			default_role = session.exec(select(Role).where(Role.role == RoleType.USER)).first()
			if not default_role:
				raise ValueError("Default role not found")
			return default_role.id

	@staticmethod
	def register(user: UserRegister, ip: str) -> SessionModel:
		with Session(engine) as session:
			if session.exec(select(Auth).where(Auth.email == user.email)).first():
				raise EmailAlreadyExistsError
			new_auth = Auth(
				email=user.email,
				password=user.password,
				role_id=QueryingUtils.get_default_role_id(),
			)
			session.add(new_auth)
			searched_auth = session.exec(select(Auth).where(Auth.email == user.email)).first()
			if not searched_auth:
				raise UserCreationError
			new_user = User(
				name=user.name,
				last_name=user.last_name,
				date_of_birth=user.date_of_birth,
				auth_id=searched_auth.id,
			)
			session.add(new_user)
			searched_user = session.exec(
				select(User).where(User.auth_id == searched_auth.id)
			).first()
			if not searched_user:
				raise UserCreationError
			new_session = SessionModel(user_id=searched_user.id, device_ip=ip)
			session.add(new_session)
			session.commit()
			searched_session = session.exec(
				select(SessionModel).where(SessionModel.user_id == searched_user.id)
			).first()
			if not searched_session:
				raise UserCreationError
			return searched_session

	@staticmethod
	def find_auth_by_email(email: str) -> Auth | None:
		with Session(engine) as session:
			return session.exec(select(Auth).where(Auth.email == email)).first()
