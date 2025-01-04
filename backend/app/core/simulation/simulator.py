import asyncio
import logging
import time

import numpy as np

from sqlmodel import select

from app.core.models.company import Company
from app.core.settings import Settings
from app.core.utils.querying_utils import QueryingUtils
from app.database import database_manager

logger = logging.getLogger(__name__)
settings = Settings()
db = database_manager


class Stock:
	def __init__(self, ticker: str, id: str) -> None:
		self.ticker = ticker
		self.id = id
		self.price_history: list[tuple[float, float]] = []
		self.last_price_update_time = time.time()
		self.simulator: StockPriceSimulator
		# TODO: add exchange

	def gen_next_price(self) -> None:
		self.price_history.append(self.simulator.generate_next_price())

		if len(self.price_history) > settings.simulation_lookback_amount:
			self.price_history.pop(0)

	def get_latest_price(self) -> float:
		return self.price_history[-1][0]


class StockPriceSimulator:
	def __init__(self, initial_price: float, mu: float, sigma: float) -> None:
		self.current_price = initial_price
		self.mu = mu
		self.sigma = sigma

	def generate_next_price(self, dt: float = 1 / (252 * 8 * 60 * 60)) -> tuple[float, float]:
		dW = np.random.normal(0, np.sqrt(dt))
		self.current_price *= np.exp((self.mu - 0.5 * self.sigma**2) * dt + self.sigma * dW)

		sell_price = np.random.triangular(
			left=self.current_price * (1 - 0.01),
			mode=self.current_price * (1 - 0.007),
			right=self.current_price * (1 - 0.001),
			size=1,
		)

		return float(self.current_price), float(sell_price[0])


class StockPriceManager:
	def __init__(self) -> None:
		self.stocks = self.create_stock_list()
		self.last_db_update = time.time()

		newest_price_for_all_stocks = QueryingUtils.get_newest_price_for_all_stocks()

		for stock in self.stocks:
			last_known_price = newest_price_for_all_stocks.get(
				stock.ticker, {"buy": 100, "sell": 100}
			)
			stock.price_history = [(last_known_price["buy"], last_known_price["sell"])]
			stock.simulator = StockPriceSimulator(stock.get_latest_price(), 0.2, 0.4)

	def create_stock_list(self) -> list[Stock]:
		with db.get_session() as session:
			return [Stock(stock.ticker, stock.id) for stock in session.exec(select(Company)).all()]

	async def generate_prices(self) -> None:
		while True:
			start_time = time.time()
			for stock in self.stocks:
				stock.gen_next_price()

			await self.try_db_insert()
			await self.check_gen_time(start_time)
			await asyncio.sleep(1 - (time.time() % settings.simulation_step_time_s))

	async def check_gen_time(self, time_start: float) -> None:
		if (time.time() - time_start) > settings.simulation_time_error_threshold_s:
			logger.error("Price generation took too long")

	async def try_db_insert(self) -> None:
		if time.time() % settings.simulation_database_snapshot_time_s < 1:
			logger.info("Inserting price snapshot into the database")
			await QueryingUtils.insert_prices(
				[(stock.id, stock.price_history[-1]) for stock in self.stocks]
			)

			if (
				self.last_db_update
				+ settings.simulation_database_snapshot_time_s
				+ settings.simulation_step_time_s
				< time.time()
			):
				logger.fatal("Database update was skipped")

			self.last_db_update = time.time()
