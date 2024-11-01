from peewee import ForeignKeyField, TextField

from app.core.models.base_model import BaseModel, cuid_generator
from app.core.models.role import Role


class Auth(BaseModel):
    id = TextField(primary_key=True, default=cuid_generator)
    role_id = ForeignKeyField(Role)
    email = TextField()
    password = TextField()

    class Meta:
        table_name = "auth"
