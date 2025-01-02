import datetime
import random

import requests

from sqlmodel import select

from app.core.models import (
	Auth,
	Company,
	Exchange,
	Industry,
	Role,
	User,
)
from app.core.models.role import RoleType
from app.database import database_manager


class InitDB:
	def __init__(self) -> None:
		self.db = database_manager

		self.add_role_data()
		self.add_auth_data()
		self.add_user_data()
		self.add_dummy_data("https://pastebin.com/raw/cmwnjrBf", Exchange, [])
		self.add_dummy_data("https://pastebin.com/raw/HH5uPbia", Industry, [])
		self.add_dummy_data("https://pastebin.com/raw/fmbJktwU", Company, [Exchange, Industry])

	def add_dummy_data(
		self,
		url: str,
		model: type[Company] | type[Exchange] | type[Industry],
		foreign_keys: list[type[Exchange] | type[Industry]],
	) -> None:
		with self.db.get_session() as session:
			if session.exec(select(model)).first():  # pragma: no cover
				return

			data = requests.get(url, timeout=5).json()

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
						f"{key.__name__.lower()}_id": random.choice(
							session.exec(select(key)).all()
						).id
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
