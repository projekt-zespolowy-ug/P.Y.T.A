from enum import Enum

from peewee import TextField

from app.core.models.base_model import BaseModel, cuid_generator


class RoleType(Enum):
	ADMIN = "admin"
	USER = "user"
	MOD = "mod"
	BANNED = "banned"
	DELETED = "deleted"


class Role(BaseModel):
	id = TextField(primary_key=True, default=cuid_generator)
	role = TextField(choices=[(type.value, type.name) for type in RoleType], unique=True)

	class Meta:
		table_name = "role"
