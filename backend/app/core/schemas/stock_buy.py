from pydantic import BaseModel


class StockBuy(BaseModel):
	amount: float
