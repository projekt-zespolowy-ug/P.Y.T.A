from datetime import datetime

from sqlmodel import TIMESTAMP, Column, Field

from app.core.models.base_table import BaseTable
from app.core.utils.querying_utils import QueryingUtils


class Session(BaseTable, table=True):
	user_id: str = Field(foreign_key="user.id")
	device_ip: str
	expires: datetime = Field(
		sa_column=Column(
			TIMESTAMP(timezone=True),
			nullable=False,
		),
		default_factory=QueryingUtils.session_expire_timestamp_factory,
	)
