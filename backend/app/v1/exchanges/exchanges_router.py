from fastapi import APIRouter, Request
from sqlmodel import select

from app.core.models.exchange import Exchange
from app.core.schemas.exchange import Exchange as ExchangeSchema
from app.database import database_manager

exchanges_router = APIRouter(prefix="/exchanges")


@exchanges_router.get("/")
async def get_industries(request: Request) -> list[ExchangeSchema]:
	with database_manager.get_session() as session:
		exchanges = session.exec(select(Exchange)).all()

		return [
			ExchangeSchema(
				name=exchange.name,
				time_open=exchange.time_open,
				time_close=exchange.time_close,
				currency=exchange.currency,
			)
			for exchange in exchanges
		]
