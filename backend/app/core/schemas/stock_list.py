from pydantic import BaseModel, field_validator


class Stock(BaseModel):
	name: str
	industry: str
	ticker: str
	exchange: str
	image_url: str | None
	buy: float
	sell: float

	@field_validator("image_url")
	def validate_image_url(cls, value: str | None) -> str:  # pragma: no cover
		if value is None:
			return "https://logodownload.org/wp-content/uploads/2014/04/intel-logo-1-1.png"
		return value


class StockList(BaseModel):
	stocks: list[Stock]
	returned_count: int
	is_last_page: bool
