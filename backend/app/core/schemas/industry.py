from pydantic import BaseModel


class Industry(BaseModel):
	name: str
	locale_name: str | None = None
