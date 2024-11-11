from pydantic import EmailStr, validator
from sqlmodel import Field, String

from app.core.models.base_table import BaseTable
from app.core.utils.querying_utils import QueryingUtils


class Auth(BaseTable, table=True):
	role_id: str = Field(foreign_key="role.id")
	email: EmailStr = Field(
		sa_type=String,
		unique=True,
		index=True,
		nullable=False,
	)
	password: str = Field(nullable=False)

	@validator("password")
	def hash_password(cls, value: str) -> str:
		if value:
			return QueryingUtils.hash_password(value)
		raise ValueError("Password must not be empty")

	class Config:
		validate_assignment = True
