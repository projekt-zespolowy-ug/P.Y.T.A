from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class StockOrderOut(BaseModel):
	amount: float
	unit_price: float
	timestamp: datetime = datetime.now()
	order_type: Literal["buy", "sell"]
