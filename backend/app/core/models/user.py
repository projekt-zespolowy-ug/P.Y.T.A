from datetime import date

from sqlmodel import DATE, Column, Field

from app.core.models.base_table import BaseTable


class User(BaseTable, table=True):
	auth_id: str = Field(foreign_key="auth.id")
	name: str
	last_name: str
	date_of_birth: date = Field(sa_column=Column(DATE, nullable=False))
