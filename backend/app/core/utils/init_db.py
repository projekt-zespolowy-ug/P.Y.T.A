import random

import requests
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
from app.core.models.role import RoleType
from app.core.utils.querying_utils import QueryingUtils
from app.database import db

db.connect()


class InitDB:
    def __init__(self) -> None:
        self.create_tables()
        self.add_role_data()
        self.add_auth_data()
        self.add_user_data()
        self.add_dummy_data("https://pastebin.com/raw/KBVnSJtp", Exchange, [])
        self.add_dummy_data("https://pastebin.com/raw/HH5uPbia", Industry, [])
        self.add_dummy_data(
            "https://pastebin.com/raw/fmbJktwU", Company, [Exchange, Industry]
        )

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

    def add_dummy_data(
        self,
        url: str,
        model: type[Company] | type[Exchange] | type[Industry],
        foreign_keys: list[type[Exchange] | type[Industry]],
    ) -> None:
        if not model.select().count():
            data = requests.get(url, verify=False).json()
            with db.atomic():
                for record in data:
                    model.create(
                        **record,
                        **{
                            key.__name__.lower() + "_id": random.choice(
                                list(key.select())
                            ).id
                            for key in foreign_keys
                        },
                    )

    def add_role_data(self) -> None:
        if not Role.select().count():
            with db.atomic():
                for role in RoleType:
                    Role.create(role=role.value)

    def add_auth_data(self) -> None:
        if not Auth.select().count():
            roles = list(Role.select())
            auth_data = requests.get(
                "https://pastebin.com/raw/Mmf4yLr8", verify=False
            ).json()
            with db.atomic():
                for record in auth_data:
                    random_role = random.choice(roles)
                    Auth.create(
                        email=record["email"],
                        password=QueryingUtils.hash_password(record["password"]),
                        role_id=random_role,
                    )

    def add_user_data(self) -> None:
        if not User.select().count():
            auth_records = list(Auth.select())
            user_data = requests.get(
                "https://pastebin.com/raw/upc7sbBN", verify=False
            ).json()
            with db.atomic():
                for index, record in enumerate(user_data):
                    User.create(**record, auth_id=auth_records[index])
