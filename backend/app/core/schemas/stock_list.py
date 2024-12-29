from pydantic import BaseModel


class Stock(BaseModel):
	name: str
	industry: str
	exchange: str
	buy: float
	sell: float


class StockList(BaseModel):
	stocks: dict[str, Stock]
	returned_count: int
	is_last_page: bool
