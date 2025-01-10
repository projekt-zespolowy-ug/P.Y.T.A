import re

from datetime import datetime, timedelta, timezone

from app.core.constants.time import UNIT_TIME
from app.core.exceptions import InvalidPeriodError  # pragma: no cover


class DateTimeUtils:
	@staticmethod
	def get_time_threshold(period: str) -> datetime:  # pragma: no cover
		match = re.match(r"(\d+)([a-zA-Z]{1,3})\b", period)
		if not match:
			raise InvalidPeriodError()

		period_value = int(match.group(1))
		period_unit = match.group(2).lower()

		if period_unit not in UNIT_TIME:
			raise InvalidPeriodError()

		if period_unit == "min":
			time_threshold = datetime.now(timezone(timedelta(hours=-1))) - timedelta(
				minutes=period_value
			)
		elif period_unit == "h":
			time_threshold = datetime.now(timezone(timedelta(hours=-1))) - timedelta(
				hours=period_value
			)
		elif period_unit == "d":
			time_threshold = datetime.now(timezone(timedelta(hours=-1))) - timedelta(
				days=period_value
			)
		elif period_unit == "w":
			time_threshold = datetime.now(timezone(timedelta(hours=-1))) - timedelta(
				weeks=period_value
			)
		elif period_unit == "mth":
			time_threshold = datetime.now(timezone(timedelta(hours=-1))) - timedelta(
				days=30 * period_value
			)
		elif period_unit == "y":
			time_threshold = datetime.now(timezone(timedelta(hours=-1))) - timedelta(
				days=365 * period_value
			)

		return time_threshold
