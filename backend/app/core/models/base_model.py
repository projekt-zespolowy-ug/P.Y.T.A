from collections.abc import Callable

from cuid2 import cuid_wrapper
from peewee import Model

from app.database import db

cuid_generator: Callable[[], str] = cuid_wrapper()


class BaseModel(Model):
    class Meta:
        database = db
