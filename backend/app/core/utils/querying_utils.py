import bcrypt


class QueryingUtils:
	@staticmethod
	def hash_password(password: str) -> str:
		password_bytes = password.encode("utf-8")
		hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
		return hashed_bytes.decode("utf-8")
