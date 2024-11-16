from datetime import UTC, datetime, timedelta

import bcrypt


class ModelUtils:
	@staticmethod
	def hash_password(password: str) -> str:
		password_bytes = password.encode("utf-8")
		hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
		return hashed_bytes.decode("utf-8")

	@staticmethod
	def session_expire_timestamp_factory() -> datetime:
		return datetime.now(UTC) + timedelta(days=30)
