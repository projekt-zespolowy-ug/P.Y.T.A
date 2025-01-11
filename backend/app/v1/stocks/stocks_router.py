import asyncio
import logging
import time

from fastapi import APIRouter, HTTPException, Request, WebSocket

from app.core.constants.time import UNIT_TIME
from app.core.exceptions import InvalidPeriodError, InvalidTimeUnitError, TickerNotFoundError
from app.core.schemas.exchange import Exchange as ExchangeSchema
from app.core.schemas.industry import Industry as IndustrySchema
from app.core.schemas.stock_details import StockDetails
from app.core.schemas.stock_list import Stock, StockList
from app.core.schemas.stock_prices import StockPrices
from app.core.settings import Settings
from app.core.utils.querying_utils import QueryingUtils
from app.database import database_manager

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
	with database_manager.get_session() as session:
		stocks = list(
			QueryingUtils.get_stock_details(
				session,
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
	with database_manager.get_session() as session:
		result = QueryingUtils.get_stock_details(session, [ticker])

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


@stocks_router.get("/price/{ticker}")
async def get_stock_price(
	ticker: str, period: str, time_unit: str, request: Request
) -> list[StockPrices]:
	try:  # pragma: no cover
		with database_manager.get_session() as session:
			if time_unit not in UNIT_TIME:
				raise InvalidTimeUnitError()

			result = QueryingUtils.get_stock_prices(session, ticker, period, time_unit)

			stock_prices = [
				StockPrices(
					timestamp=stock.timestamp,
					buy=stock.buy,
					sell=stock.sell,
					ticker=ticker,
				)
				for stock in result
			]

			stock_from_memory = list(
				filter(lambda x: x.ticker == ticker, request.app.state.stock_manager.stocks)
			)[0]

			if time_unit != "min" or time_unit != "s":
				stock_prices[-1].buy = stock_from_memory.price_history[-1][0]
				stock_prices[-1].sell = stock_from_memory.price_history[-1][1]

			return stock_prices

	except InvalidPeriodError as _:
		logger.error(f"Invalid period: {period}")
		raise HTTPException(status_code=400, detail="Invalid period") from None
	except TickerNotFoundError as _:
		logger.error(f"Ticker not found: {ticker}")
		raise HTTPException(status_code=404, detail="Ticker not found") from None
	except InvalidTimeUnitError as _:
		logger.error(f"Invalid time unit: {time_unit}")
		raise HTTPException(status_code=400, detail="Invalid time unit") from None
	except Exception as e:  # pragma: no cover
		logger.error("Failed to get stock prices", exc_info=True)
		raise HTTPException(status_code=500, detail="Failed to get stock prices") from e
