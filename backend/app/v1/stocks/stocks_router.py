import asyncio
import logging
import time

from fastapi import APIRouter, HTTPException, Request, WebSocket

from app.core.models.company import Company
from app.core.models.exchange import Exchange
from app.core.models.industry import Industry
from app.core.schemas.exchange import Exchange as ExchangeSchema
from app.core.schemas.industry import Industry as IndustrySchema
from app.core.schemas.stock_details import StockDetails
from app.core.schemas.stock_list import Stock, StockList
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
	industry: str = "",
	exchange: str = "",
) -> StockList:
	# Convert QueryingUtils result to a list to resolve return type issue
	stocks: list[tuple[Company, Industry, Exchange]] = list(
		QueryingUtils.get_stock_details(
			[stock.ticker for stock in request.app.state.stock_manager.stocks],
			industry,
			exchange,
			limit,
			page,
		)
	)

	stock_list: dict[str, Stock] = {}

	for stock, industry_obj, exchange_obj in stocks:
		price = list(
			filter(lambda x: x.ticker == stock.ticker, request.app.state.stock_manager.stocks)
		)[0].price_history[-1]

		stock_list[stock.name] = Stock(
			name=stock.name,
			industry=industry_obj.name,  # Use .name attribute of industry object
			exchange=exchange_obj.name,  # Use .name attribute of exchange object
			buy=price[0],
			sell=price[1],
		)

	return StockList(
		stocks=stock_list, returned_count=len(stocks), is_last_page=len(stocks) < limit
	)


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


@stocks_router.get("/{ticker}")
async def get_stock(ticker: str, request: Request) -> StockDetails:
	result = QueryingUtils.get_stock_details([ticker])

	if not result:
		raise HTTPException(status_code=404, detail="Stock not found")

	stock, industry, exchange = result[0]

	return StockDetails(
		name=stock.name,
		description=stock.description,
		ticker=stock.ticker,
		industry=IndustrySchema(name=industry.name),
		exchange=ExchangeSchema(
			name=exchange.name,
			time_open=exchange.time_open,
			time_close=exchange.time_close,
			currency=exchange.currency,
		),
	)
