from enum import Enum

from app.core.models.base_table import BaseTable


class RoleType(Enum):
	ADMIN = "admin"
	USER = "user"
	MOD = "mod"
	BANNED = "banned"
	DELETED = "deleted"


class Role(BaseTable, table=True):
	role: RoleType
