from pydantic import BaseModel, field_validator


class StockOrder(BaseModel):
	amount: float

	@field_validator("amount")
	def validate_amount(cls, v: float) -> float:
		if v <= 0:
			raise ValueError("The amount must be greater than 0")

		if int(v * 100000) != v * 100000:
			raise ValueError("The amount must have a maximum of 4 decimal places")

		return v
