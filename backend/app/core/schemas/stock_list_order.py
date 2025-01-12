from pydantic import BaseModel, field_validator


class StockListOrder(BaseModel):
	order_by: str | None = "name"
	order: str | None = "asc"

	@field_validator("order")
	def validate_order(cls, value: str) -> str:
		if value.lower() in {"asc", "desc"}:
			return value.lower()
		raise ValueError("Invalid order type")

	@field_validator("order_by")
	def validate_order_by(cls, value: str) -> str:
		if value.lower() in {"name", "price"}:
			return value.lower()
		raise ValueError("Invalid order_by type")
