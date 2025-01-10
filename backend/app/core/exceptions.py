class UserCreationError(Exception):
	pass


class EmailAlreadyExistsError(Exception):
	pass


class InvalidCredentialsError(Exception):
	pass


class UserNotFoundError(Exception):
	pass


class UserNotLoggedInError(Exception):
	pass


class TickerNotFoundError(Exception):
	pass


class InvalidPeriodError(Exception):
	pass


class InvalidTimeUnitError(Exception):
	pass
