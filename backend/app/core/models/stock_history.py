from datetime import datetime

from sqlmodel import TIMESTAMP, Column, Field, text

from app.core.models.base_table import BaseTable


class StockHistory(BaseTable, table=True):
	company_id: str = Field(foreign_key="company.id")
	buy: float
	sell: float
	timestamp: datetime = Field(
		sa_column=Column(
			TIMESTAMP(timezone=True), nullable=False, server_default=text("CURRENT_TIMESTAMP")
		)
	)

	__tablename__ = "stock_history"
