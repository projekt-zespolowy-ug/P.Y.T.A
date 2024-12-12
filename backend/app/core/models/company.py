from pydantic import field_validator
from sqlmodel import Field

from app.core.models.base_table import BaseTable


class Company(BaseTable, table=True):
	industry_id: str = Field(foreign_key="industry.id")
	exchange_id: str = Field(foreign_key="exchange.id")
	name: str
	description: str
	ticker: str
	image_url: str | None

	@field_validator("image_url")
	def validate_image_url(cls, value: str) -> str:
		if (
			value
			== r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
			or value == ""
		):
			return value
		raise ValueError("Invalid image URL")
