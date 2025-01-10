import re

from datetime import UTC, datetime, timedelta

from app.core.exceptions import InvalidPeriodError


class DateTimeUtils:
	@staticmethod
	def get_time_threshold(period: str) -> datetime:  # pragma: no cover
		match = re.match(r"(\d+)([a-zA-Z]{1,3})\b", period)
		if not match:
			raise InvalidPeriodError()

		period_value = int(match.group(1))
		period_unit = match.group(2).lower()

		if period_unit not in ["min", "h", "d", "w", "mth", "y"]:
			raise InvalidPeriodError()

		if period_unit == "min":
			time_threshold = datetime.now(UTC) - timedelta(minutes=period_value)
		elif period_unit == "h":
			time_threshold = datetime.now(UTC) - timedelta(hours=period_value)
		elif period_unit == "d":
			time_threshold = datetime.now(UTC) - timedelta(days=period_value)
		elif period_unit == "w":
			time_threshold = datetime.now(UTC) - timedelta(weeks=period_value)
		elif period_unit == "mth":
			time_threshold = datetime.now(UTC) - timedelta(days=30 * period_value)
		elif period_unit == "y":
			time_threshold = datetime.now(UTC) - timedelta(days=365 * period_value)

		return time_threshold
