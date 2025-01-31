from datetime import datetime

from pydantic import BaseModel


class StockBuyOut(BaseModel):
	amount: float
	unit_price: float
	timestamp: datetime = datetime.now()
