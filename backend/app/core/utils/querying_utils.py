from datetime import UTC, datetime, timedelta

import bcrypt

from sqlmodel import Session, select

from app.core.models.role import Role, RoleType
from app.database import engine


class QueryingUtils:
	@staticmethod
	def hash_password(password: str) -> str:
		password_bytes = password.encode("utf-8")
		hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
		return hashed_bytes.decode("utf-8")

	@staticmethod
	def session_expire_timestamp_factory() -> datetime:
		return datetime.now(UTC) + timedelta(days=30)

	@staticmethod
	def get_default_role_id() -> str:
		with Session(engine) as session:
			default_role = session.exec(select(Role).where(Role.role == RoleType.USER)).first()
			if not default_role:
				raise ValueError("Default role not found")
			return default_role.id
