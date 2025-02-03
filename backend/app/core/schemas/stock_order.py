from pydantic import BaseModel


class StockOrder(BaseModel):
	amount: float
