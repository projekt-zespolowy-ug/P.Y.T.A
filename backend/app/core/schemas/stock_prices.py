from datetime import datetime

from pydantic import BaseModel


class StockPrices(BaseModel):
	timestamp: datetime
	min: float
	max: float
	open: float
	close: float
