from datetime import datetime

from pydantic import BaseModel


class StockPrices(BaseModel):
	timestamp: datetime
	buy_price: float
	sell_price: float
	ticker: str
