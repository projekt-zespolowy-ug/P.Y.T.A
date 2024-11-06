from typing import Any

import bcrypt


class QueryingUtils:
	@staticmethod
	def hash_password(password: Any) -> Any:
		password_bytes = password.encode("utf-8")
		hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
		return hashed_bytes.decode("utf-8")
