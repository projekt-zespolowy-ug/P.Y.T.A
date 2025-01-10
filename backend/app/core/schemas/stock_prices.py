from datetime import datetime

from pydantic import BaseModel


class StockPrices(BaseModel):
	timestamp: datetime
	buy: float
	sell: float
	ticker: str
