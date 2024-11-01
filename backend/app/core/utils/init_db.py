from app.core.models import (
    Auth,
    Company,
    Exchange,
    Industry,
    Role,
    StockHistory,
    Transaction,
    User,
)
from app.database import db

db.connect()


class InitDB:
    def __init__(self) -> None:
        self.create_tables()

    def create_tables(self) -> None:
        db.create_tables(
            [
                Auth,
                Company,
                Exchange,
                Industry,
                Role,
                StockHistory,
                Transaction,
                User,
            ],
            safe=True,
        )
