from peewee import TextField, TimeField

from app.core.models.base_model import BaseModel, cuid_generator


class Exchange(BaseModel):
	id = TextField(primary_key=True, default=cuid_generator)
	name = TextField()
	time_open = TimeField()
	time_close = TimeField()
	timezone = TextField()
	currency = TextField()

	class Meta:
		table_name = "exchange"
