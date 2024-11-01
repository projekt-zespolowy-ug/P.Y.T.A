from peewee import ForeignKeyField, TextField, TimestampField

from app.core.models.base_model import BaseModel, cuid_generator
from app.core.models.stock_history import StockHistory
from app.core.models.user import User


class Transaction(BaseModel):
    id = TextField(primary_key=True, default=cuid_generator)
    user_id = ForeignKeyField(User)
    stock_history_id = ForeignKeyField(StockHistory)
    amount = TextField()
    timestamp = TimestampField()

    class Meta:
        table_name = "transaction"
