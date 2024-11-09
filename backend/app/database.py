from sqlmodel import create_engine

from app.core.settings import Settings

settings = Settings()

db_url = f"postgresql+psycopg2://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/pyta"
engine = create_engine(db_url)
