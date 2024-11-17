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
