from pydantic import BaseModel


class UserOut(BaseModel):
	first_name: str
	last_name: str
	balance: float
	hashed_email: str
