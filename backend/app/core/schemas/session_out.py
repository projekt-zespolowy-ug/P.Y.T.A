from pydantic import BaseModel


class SessionOut(BaseModel):
	session_id: str
