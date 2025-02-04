from pydantic import BaseModel


class PortfolioOut(BaseModel):
	name: str
	ticker: str
	amount: float
	price: float
