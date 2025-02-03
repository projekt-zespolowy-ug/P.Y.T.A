import logging

from contextlib import contextmanager
from typing import Any

from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, StaticPool, create_engine

from app.core.settings import Settings

settings = Settings()


class DatabaseManager:
	def __init__(self, db_url: str = "sqlite:///:memory:") -> None:
		connect_args = {} if "psycopg2" in db_url else {"check_same_thread": False}

		self.engine = create_engine(db_url, connect_args=connect_args, poolclass=StaticPool)
		self.create_tables()
		self.Sessionmaker = sessionmaker(self.engine)

	@contextmanager
	def get_session(self) -> Any:
		session = self.Sessionmaker()

		session.exec = session.scalars  # type: ignore [attr-defined]

		try:
			yield session
			session.commit()
		except Exception:
			session.rollback()
			raise
		finally:
			session.close()

	def get_session_no_context(self) -> Any:
		session = self.Sessionmaker()

		session.exec = session.scalars  # type: ignore [attr-defined]

		return session

	def create_tables(self) -> None:
		from app.core.models import Auth  # noqa: F401

		SQLModel.metadata.create_all(bind=self.engine)

	def drop_tables(self) -> None:
		from app.core.models import Auth  # noqa: F401

		SQLModel.metadata.drop_all(bind=self.engine)


if not settings.testing:
	db_url = f"postgresql+psycopg2://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/pyta"
else:
	db_url = "sqlite:///:memory:"

logging.info(f"db_url: {db_url}")

database_manager = DatabaseManager(db_url)
