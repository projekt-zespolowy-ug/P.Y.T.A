from peewee import ForeignKeyField, TextField

from app.core.models.base_model import BaseModel, cuid_generator
from app.core.models.exchange import Exchange
from app.core.models.industry import Industry


class Company(BaseModel):
	id = TextField(primary_key=True, default=cuid_generator)
	industry_id = ForeignKeyField(Industry)
	exchange_id = ForeignKeyField(Exchange)
	name = TextField()
	description = TextField()
	ticker = TextField()

	class Meta:
		table_name = "company"
