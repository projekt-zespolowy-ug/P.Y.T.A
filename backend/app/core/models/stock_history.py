from peewee import (
    FloatField,
    ForeignKeyField,
    TextField,
    TimestampField,
)

from app.core.models.base_model import BaseModel, cuid_generator
from app.core.models.company import Company


class StockHistory(BaseModel):
    id = TextField(primary_key=True, default=cuid_generator)
    company_id = ForeignKeyField(Company)
    buy = FloatField()
    sell = FloatField()
    timestamp = TimestampField()

    class Meta:
        table_name = "stock_history"
