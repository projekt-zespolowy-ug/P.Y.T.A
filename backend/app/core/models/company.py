from sqlmodel import Field

from app.core.models.base_table import BaseTable


class Company(BaseTable, table=True):
	industry_id: str = Field(foreign_key="industry.id")
	exchange_id: str = Field(foreign_key="exchange.id")
	name: str
	description: str
	ticker: str
