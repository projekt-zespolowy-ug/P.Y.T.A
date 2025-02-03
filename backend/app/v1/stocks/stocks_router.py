import asyncio
import logging
import time

from typing import Any

from fastapi import APIRouter, HTTPException, Request, WebSocket, WebSocketDisconnect, status
from fastapi.params import Depends
from fastapi.websockets import WebSocketState

from app.core.constants.time import UNIT_TIME
from app.core.exceptions import (
	InvalidPeriodError,
	InvalidTimeUnitError,
	TickerNotFoundError,
)
from app.core.models.transaction import Transaction
from app.core.schemas.exchange import Exchange as ExchangeSchema
from app.core.schemas.industry import Industry as IndustrySchema
from app.core.schemas.stock_details import StockDetails
from app.core.schemas.stock_list import Stock, StockList
from app.core.schemas.stock_list_order import StockListOrder
from app.core.schemas.stock_order import StockOrder
from app.core.schemas.stock_order_out import StockOrderOut
from app.core.schemas.stock_prices import StockPrices
from app.core.settings import Settings
from app.core.simulation.simulator import Stock as SimStock
from app.core.utils.querying_utils import QueryingUtils
from app.database import database_manager

stocks_router = APIRouter(prefix="/stocks")

settings = Settings()

logger = logging.getLogger(__name__)


def get_user_from_token(request: Request) -> dict[str, Any]:
	token = request.cookies.get("session_id")

	if not token:
		raise HTTPException(status_code=401, detail="Unauthorized")

	with database_manager.get_session() as session:
		if user := QueryingUtils.get_user_from_token(session, token):
			return user
		else:
			raise HTTPException(status_code=401, detail="Unauthorized")


@stocks_router.get("")
async def list_stocks(
	request: Request,
	limit: int = 50,
	page: int = 1,
	industry: str = "",
	exchange: str = "",
	name: str = "",
	order_params: StockListOrder = Depends(),  # type: ignore[assignment]
) -> StockList:
	with database_manager.get_session() as session:
		stocks = list(
			QueryingUtils.get_stock_list(
				session,
				industry,
				exchange,
				order_params.order_by,
				order_params.order,
				name,
				limit,
				page,
			)
		)

		stock_list: list[Stock] = []

		for stock, industry_obj, exchange_obj in stocks:
			price = list(
				filter(lambda x: x.ticker == stock.ticker, request.app.state.stock_manager.stocks)
			)[0].price_history[-1]

			stock_list.append(
				Stock(
					name=stock.name,
					industry=industry_obj.name,
					ticker=stock.ticker,
					exchange=exchange_obj.name,
					image_url=stock.image_url,
					buy=price[0],
					sell=price[1],
				)
			)

		return StockList(
			stocks=stock_list, returned_count=len(stocks), is_last_page=len(stocks) < limit
		)


@stocks_router.websocket("/updates/{ticker}")
async def stock_updates(ticker: str, websocket: WebSocket) -> None:
	stock = list(filter(lambda x: x.ticker == ticker, websocket.app.state.stock_manager.stocks))

	if not stock:
		await websocket.close(code=1008, reason="Invalid ticker")
		return

	await websocket.accept()

	price_history = stock[0].price_history

	while websocket.client_state != WebSocketState.DISCONNECTED:
		try:
			await websocket.send_json({"buy": price_history[-1][0], "sell": price_history[-1][1]})
		except WebSocketDisconnect as _:  # pragma: no cover
			break

		await asyncio.sleep(
			1
			- (time.time() % settings.simulation_step_time_s)
			+ 0.1 * settings.simulation_step_time_s
		)


@stocks_router.get("/{ticker}")
async def get_stock(ticker: str, request: Request) -> StockDetails:
	with database_manager.get_session() as session:
		result = QueryingUtils.get_stock_details(session, ticker)

		if not result:
			raise HTTPException(status_code=404, detail="Stock not found")

		stock, industry, exchange = result

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
					timestamp=stock["timestamp"],
					min=stock["min"],
					max=stock["max"],
					open=stock["open"],
					close=stock["close"],
				)
				for stock in result
			]

			stock_from_memory = list(
				filter(lambda x: x.ticker == ticker, request.app.state.stock_manager.stocks)
			)[0]

			if time_unit != "min" or time_unit != "s":
				stock_prices[-1].close = stock_from_memory.price_history[-1][0]
				if min(stock_from_memory.price_history[-1]) < stock_prices[-1].min:
					stock_prices[-1].min = min(stock_from_memory.price_history[-1])
				if max(stock_from_memory.price_history[-1]) > stock_prices[-1].max:
					stock_prices[-1].max = max(stock_from_memory.price_history[-1])

			return stock_prices

	except InvalidPeriodError as _:
		logger.error(f"Invalid period: {period}")
		raise HTTPException(status_code=422, detail="Invalid period") from None
	except TickerNotFoundError as _:
		logger.error(f"Ticker not found: {ticker}")
		raise HTTPException(status_code=404, detail="Ticker not found") from None
	except InvalidTimeUnitError as _:
		logger.error(f"Invalid time unit: {time_unit}")
		raise HTTPException(status_code=422, detail="Invalid time unit") from None
	except Exception as e:  # pragma: no cover
		logger.error("Failed to get stock prices", exc_info=True)
		raise HTTPException(status_code=500, detail="Failed to get stock prices") from e


@stocks_router.post("/{ticker}/buy")
async def buy_stock(
	ticker: str,
	stock_buy: StockOrder,
	request: Request,
	user: Any = Depends(get_user_from_token),
) -> StockOrderOut:
	stock = list(filter(lambda x: x.ticker == ticker, request.app.state.stock_manager.stocks))

	if not stock:
		raise HTTPException(status_code=404, detail="Stock not found")

	stock_sim: SimStock = stock[0]

	unit_buy_price = stock_sim.price_history[-1][0]
	transaction_cost = unit_buy_price * stock_buy.amount

	if user["balance"] < transaction_cost:
		raise HTTPException(status_code=402, detail="Insufficient funds")

	with database_manager.get_session() as session:
		new_transaction = Transaction(
			user_id=user["id"],
			company_id=stock_sim.id,
			amount=stock_buy.amount,
			unit_price=unit_buy_price,
			transaction_type="buy",
		)

		session.add(new_transaction)

		QueryingUtils.update_user_balance(session, user["id"], -transaction_cost)
		QueryingUtils.update_user_portfolio(
			session, user["id"], stock_sim.id, stock_buy.amount, True
		)

	return StockOrderOut(
		amount=stock_buy.amount,
		unit_price=unit_buy_price,
		order_type="buy",
	)


@stocks_router.post("/{ticker}/sell")
async def sell_stock(
	ticker: str,
	stock_buy: StockOrder,
	request: Request,
	user: Any = Depends(get_user_from_token),
) -> StockOrderOut:
	stock = list(filter(lambda x: x.ticker == ticker, request.app.state.stock_manager.stocks))

	if not stock:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stock not found")

	stock_sim: SimStock = stock[0]

	unit_sell_price = stock_sim.price_history[-1][1]
	transaction_cost = unit_sell_price * stock_buy.amount

	with database_manager.get_session() as session:
		user_portfolio = QueryingUtils.get_user_portfolio(session, user["id"], stock_sim.id)

		if not user_portfolio or user_portfolio.amount < stock_buy.amount:
			raise HTTPException(
				status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stocks"
			)

		new_transaction = Transaction(
			user_id=user["id"],
			company_id=stock_sim.id,
			amount=stock_buy.amount,
			unit_price=unit_sell_price,
			transaction_type="sell",
		)

		session.add(new_transaction)

		QueryingUtils.update_user_balance(session, user["id"], transaction_cost)
		QueryingUtils.update_user_portfolio(
			session, user["id"], stock_sim.id, stock_buy.amount, False
		)

	return StockOrderOut(
		amount=stock_buy.amount,
		unit_price=unit_sell_price,
		order_type="sell",
	)
