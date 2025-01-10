from datetime import datetime

from pydantic import BaseModel


class StockPrices(BaseModel):
	timestamp: datetime
	average_buy_price: float
	average_sell_price: float
	ticker: str
