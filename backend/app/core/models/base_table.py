from collections.abc import Callable

from cuid2 import cuid_wrapper
from sqlmodel import Field, SQLModel

cuid_generator: Callable[[], str] = cuid_wrapper()


class BaseTable(SQLModel):
	id: str = Field(primary_key=True, default_factory=cuid_generator)
