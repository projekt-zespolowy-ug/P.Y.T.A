from datetime import datetime

from sqlmodel import TIMESTAMP, Column, Field, text

from app.core.models.base_table import BaseTable


class Transaction(BaseTable, table=True):
	user_id: str = Field(foreign_key="user.id")
	company_id: str = Field(foreign_key="company.id")
	amount: float
	unit_price: float
	transaction_type: str
	timestamp: datetime = Field(
		sa_column=Column(
			TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP")
		)
	)
