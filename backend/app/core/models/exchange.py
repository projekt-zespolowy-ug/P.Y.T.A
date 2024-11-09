from datetime import time

from sqlmodel import TIME, Column, Field, text

from app.core.models.base_table import BaseTable


class Exchange(BaseTable, table=True):
	name: str
	time_open: time = Field(
		sa_column=Column(TIME(timezone=True), nullable=False, server_default=text("CURRENT_TIME"))
	)
	time_close: time = Field(
		sa_column=Column(TIME(timezone=True), nullable=False, server_default=text("CURRENT_TIME"))
	)
	currency: str
