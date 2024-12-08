import asyncio
import logging
import time

from fastapi import APIRouter, Request, WebSocket
from sqlalchemy import Sequence

from app.core.models.company import Company
from app.core.models.exchange import Exchange
from app.core.models.industry import Industry
from app.core.schemas.stock_list import StockList
from app.core.settings import Settings
from app.core.utils.querying_utils import QueryingUtils

stocks_router = APIRouter(prefix="/stocks")

settings = Settings()

logger = logging.getLogger(__name__)


@stocks_router.get("/")
async def list_stocks(
	request: Request,
	limit: int = 50,
	page: int = 1,
	industry: str = None,
	exchange: str = None,
) -> StockList:
	stocks: Sequence[Company, Industry, Exchange] = QueryingUtils.get_stock_details(
		[stock.ticker for stock in request.app.state.stock_manager.stocks],
		industry,
		exchange,
		limit,
		page,
	)

	res = {"returned_count": len(stocks), "is_last_page": len(stocks) < limit, "stocks": {}}

	for stock, industry, exchange in stocks:
		price = list(
			filter(lambda x: x.ticker == stock.ticker, request.app.state.stock_manager.stocks)
		)[0].price_history[-1]

		res["stocks"][stock.ticker] = {
			"name": stock.name,
			"industry": industry.name,
			"exchange": exchange.name,
			"buy": price[0],
			"sell": price[1],
		}

	return res


@stocks_router.websocket("/updates/{ticker}")
async def stock_updates(ticker: str, websocket: WebSocket) -> None:
	await websocket.accept()

	while True:
		price = list(
			filter(lambda x: x.ticker == ticker, websocket.app.state.stock_manager.stocks)
		)[0].price_history[-1]

		await websocket.send_json({"buy": price[0], "sell": price[1]})

		await asyncio.sleep(
			1
			- (time.time() % settings.simulation_step_time_s)
			+ 0.1 * settings.simulation_step_time_s
		)
