from datetime import time

from pydantic import BaseModel


class Exchange(BaseModel):
	name: str
	time_open: time
	time_close: time
	currency: str
