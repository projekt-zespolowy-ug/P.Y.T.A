from peewee import TextField

from app.core.models.base_model import BaseModel, cuid_generator


class Industry(BaseModel):
    id = TextField(primary_key=True, default=cuid_generator)
    name = TextField()

    class Meta:
        table_name = "industry"
