import random

import requests

from app.core.models import (
	Auth,
	Company,
	Exchange,
	Industry,
	Role,
	User,
)
from app.core.models.role import RoleType
from app.database import engine
from sqlmodel import Session, SQLModel, select


class InitDB:
	def __init__(self) -> None:
		self.create_tables()
		self.add_role_data()
		self.add_auth_data()
		self.add_user_data()
		self.add_dummy_data("https://pastebin.com/raw/cmwnjrBf", Exchange, [])
		self.add_dummy_data("https://pastebin.com/raw/HH5uPbia", Industry, [])
		self.add_dummy_data("https://pastebin.com/raw/fmbJktwU", Company, [Exchange, Industry])

	def create_tables(self) -> None:
		SQLModel.metadata.create_all(engine)

	def add_dummy_data(
		self,
		url: str,
		model: type[Company] | type[Exchange] | type[Industry],
		foreign_keys: list[type[Exchange] | type[Industry]],
	) -> None:
		with Session(engine) as session:
			if session.exec(select(model)).first():
				return

			data = requests.get(url, timeout=5).json()

			for record in data:
				new_obj = model(
					**record,
					**{
						key.__name__.lower() + "_id": random.choice(
							session.exec(select(key)).all()
						).id
						for key in foreign_keys
					},
				)

				session.add(new_obj)

			session.commit()

	def add_role_data(self) -> None:
		with Session(engine) as session:
			if session.exec(select(Role)).first():
				return

			for role in RoleType:
				new_role = Role(role=role)
				session.add(new_role)

			session.commit()

	def add_auth_data(self) -> None:
		with Session(engine) as session:
			if session.exec(select(Auth)).first():
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

			session.commit()

	def add_user_data(self) -> None:
		with Session(engine) as session:
			if session.exec(select(User)).first():
				return

			auth_records = session.exec(select(Auth)).all()
			user_data = requests.get("https://pastebin.com/raw/upc7sbBN", timeout=5).json()

			for index, record in enumerate(user_data):
				new_user = User(
					**record,
					auth_id=auth_records[index].id,
				)

				session.add(new_user)
			session.commit()
