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
from app.database import db
import random
import requests
import bcrypt


db.connect()


class InitDB:
    def __init__(self) -> None:
        self.create_tables()
        self.add_role_data()
        self.add_exchange_data()
        self.add_industry_data()
        self.add_company_data()
        self.add_auth_data()
        self.add_user_data()

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

    def hash_password(self,password) -> str:
        password_bytes = password.encode('utf-8')
        hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        return hashed_bytes.decode('utf-8')

    def add_role_data(self) -> None: 
        if Role.select().count() == 0:
            with db.atomic():
                for role in RoleType:
                    Role.create(role=role.value)

    def add_exchange_data(self) -> None:
        if Exchange.select().count() == 0:     
            exchange_data = requests.get('https://pastebin.com/raw/KBVnSJtp', verify=False).json()
            with db.atomic():
                Exchange.insert_many(exchange_data).execute()

    def add_industry_data(self) -> None:
        if Industry.select().count() == 0:
            industry_data = requests.get('https://pastebin.com/raw/HH5uPbia', verify=False).json()
            with db.atomic():
                Industry.insert_many(industry_data).execute()

    def add_company_data(self) -> None:
        if Company.select().count() == 0:
            exchanges = list(Exchange.select())
            industries = list(Industry.select())
            company_data = requests.get('https://pastebin.com/raw/fmbJktwU', verify=False).json() 
            with db.atomic():
                for record in company_data:
                    random_industry = random.choice(industries)
                    random_exchange = random.choice(exchanges)
                    Company.create(**record, exchange_id=random_exchange, industry_id=random_industry)

    def add_auth_data(self) -> None:
        if Auth.select().count() == 0:
            roles = list(Role.select())
            auth_data = requests.get('https://pastebin.com/raw/Mmf4yLr8', verify=False).json()
            with db.atomic():
                for record in auth_data:
                    random_role = random.choice(roles)
                    Auth.create(email=record['email'],password=self.hash_password(record['password']) , role_id=random_role)

    def add_user_data(self) -> None:        
        if User.select().count() == 0:
            auth_records = list(Auth.select())
            user_data = requests.get('https://pastebin.com/raw/upc7sbBN', verify=False).json()
            with db.atomic():
                for index, record in enumerate(user_data):
                    User.create(**record, auth_id=auth_records[index])

    
                    
                