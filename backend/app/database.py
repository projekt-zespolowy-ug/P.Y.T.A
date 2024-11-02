from peewee import PostgresqlDatabase

from app.core.settings import Settings

settings = Settings()

db = PostgresqlDatabase(
    "pyta",
    host=settings.db_host,
    port=settings.db_port,
    user=settings.db_user,
    password=settings.db_password,
)
