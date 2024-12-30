from pydantic import BaseModel

from app.core.schemas.exchange import Exchange
from app.core.schemas.industry import Industry


class StockDetails(BaseModel):
	name: str
	description: str
	ticker: str
	industry: Industry
	exchange: Exchange
