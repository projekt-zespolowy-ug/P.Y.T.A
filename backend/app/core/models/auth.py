from typing import Any

from peewee import ForeignKeyField, TextField

from app.core.models.base_model import BaseModel, cuid_generator
from app.core.models.role import Role
from app.core.utils.querying_utils import QueryingUtils


class Auth(BaseModel):
	id = TextField(primary_key=True, default=cuid_generator)
	role_id = ForeignKeyField(Role)
	email = TextField()
	password: str = TextField()  # type: ignore [assignment]

	class Meta:
		table_name = "auth"

	def save(self, force_insert: bool = False, only: Any | None = None) -> Any:
		if self.password:
			self.password = QueryingUtils.hash_password(self.password)

		super().save(force_insert=force_insert, only=only)
