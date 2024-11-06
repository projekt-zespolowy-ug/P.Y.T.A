from peewee import DateField, ForeignKeyField, TextField

from app.core.models.auth import Auth
from app.core.models.base_model import BaseModel, cuid_generator


class User(BaseModel):
	id = TextField(primary_key=True, default=cuid_generator)
	auth_id = ForeignKeyField(Auth)
	name = TextField()
	last_name = TextField()
	date_of_birth = DateField()

	class Meta:
		table_name = "user"
