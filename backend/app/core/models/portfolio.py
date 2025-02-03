from sqlmodel import Field

from app.core.models.base_table import BaseTable


class Portfolio(BaseTable, table=True):
	user_id: str = Field(foreign_key="user.id")
	company_id: str = Field(foreign_key="company.id")
	amount: float = Field(default=0.0)
