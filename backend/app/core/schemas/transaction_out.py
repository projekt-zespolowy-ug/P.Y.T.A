from datetime import datetime

from pydantic import BaseModel


class TransactionOut(BaseModel):
	company_name: str
	amount: float
	unit_price: float
	transaction_type: str
	timestamp: datetime
