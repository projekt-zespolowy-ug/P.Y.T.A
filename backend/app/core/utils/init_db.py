import datetime
import json
import random

from pathlib import Path

import requests

from sqlalchemy import or_
from sqlmodel import select, text

from app.core.models import (
	Auth,
	Company,
	Exchange,
	Industry,
	Role,
	User,
)
from app.core.models.role import RoleType
from app.core.settings import Settings
from app.database import database_manager

settings = Settings()


class InitDB:
	def __init__(self) -> None:
		self.db = database_manager

		if not settings.testing:  # pragma: no cover
			self.add_extensions()

		self.add_role_data()
		self.add_auth_data()
		self.add_user_data()
		self.add_dummy_data(Path("datasets").joinpath("exchange.json"), Exchange, [])
		self.add_dummy_data(Path("datasets").joinpath("industry.json"), Industry, [])
		self.add_dummy_data(
			Path("datasets").joinpath("company.json"),
			Company,
			[Exchange, Industry],
		)

	def add_extensions(self) -> None:  # pragma: no cover
		with self.db.get_session() as session:
			session.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm;"))

	def add_dummy_data(
		self,
		file_path: Path,
		model: type[Company] | type[Exchange] | type[Industry],
		foreign_keys: list[type[Exchange] | type[Industry]],
	) -> None:
		with self.db.get_session() as session:
			if session.exec(select(model)).first():  # pragma: no cover
				return

			with open(file_path) as file:
				data = json.load(file)

			for record in data:
				if "time_open" in record:
					record["time_open"] = datetime.datetime.strptime(
						record["time_open"], "%H:%M %p"
					).time()
					record["time_close"] = datetime.datetime.strptime(
						record["time_close"], "%H:%M %p"
					).time()

				new_obj = model(
					**record,
					**{
						f"{key.__name__.lower()}_id": select(key.id).where(
							or_(key.name == record["industry"], key.name == record["exchange"])
						)
						for key in foreign_keys
					},
				)

				session.add(new_obj)

	def add_role_data(self) -> None:
		with self.db.get_session() as session:
			if session.exec(select(Role)).first():  # pragma: no cover
				return

			for role in RoleType:
				new_role = Role(role=role)
				session.add(new_role)

	def add_auth_data(self) -> None:
		with self.db.get_session() as session:
			if session.exec(select(Auth)).first():  # pragma: no cover
				return

			roles = session.exec(select(Role)).all()
			auth_data = requests.get("https://pastebin.com/raw/Mmf4yLr8", timeout=5).json()

			for record in auth_data:
				random_role = random.choice(roles)

				new_auth = Auth(
					**record,
					role_id=random_role.id,
				)

				session.add(new_auth)

	def add_user_data(self) -> None:
		with self.db.get_session() as session:
			if session.exec(select(User)).first():  # pragma: no cover
				return

			auth_records = session.exec(select(Auth)).all()
			user_data = requests.get("https://pastebin.com/raw/upc7sbBN", timeout=5).json()

			for index, record in enumerate(user_data):
				record["date_of_birth"] = datetime.datetime.strptime(
					record["date_of_birth"], "%m/%d/%Y"
				)

				new_user = User(
					**record,
					auth_id=auth_records[index].id,
				)

				session.add(new_user)
