from datetime import date

from dateutil.relativedelta import relativedelta
from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
	name: str
	last_name: str
	date_of_birth: date
	email: EmailStr
	password: str

	@field_validator("name", "last_name")
	def validate_length(cls, v: str) -> str:
		if len(v) > 0 and len(v) < 30:
			return v
		raise ValueError("The length of the field must be between 0 and 30 characters")

	@field_validator("date_of_birth")
	def validate_date_of_birth(cls, v: date) -> date:
		if relativedelta(date.today(), v).years > 18 and relativedelta(date.today(), v).years < 140:
			return v
		raise ValueError("The user must be between 18 and 140 years old")

	@field_validator("password")
	def validate_password(cls, v: str) -> str:
		if (
			any(char.isdigit() for char in v)
			and any(not char.isalnum() for char in v)
			and any(char.isupper() for char in v)
			and any(char.islower() for char in v)
			and len(v) > 8
		):
			return v
		raise ValueError(
			"""The password must contain at least one uppercase letter, one lowercase letter,
			one number, and be at least 8 characters long"""
		)
