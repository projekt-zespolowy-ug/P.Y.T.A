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
