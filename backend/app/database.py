import os

import dotenv
from peewee import PostgresqlDatabase

dotenv.load_dotenv(".env.local")


db = PostgresqlDatabase(
    "pyta", host=os.environ["DB_HOST"], port=5432, user="postgres", password="example"
)
