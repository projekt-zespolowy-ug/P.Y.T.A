from collections.abc import Sequence
from typing import Any

from sqlalchemy import Row, RowMapping, func
from sqlmodel import Session, and_, or_, select

from app.core.constants.time import UNIT_TIME
from app.core.exceptions import (
	TickerNotFoundError,
)
from app.core.models.company import Company
from app.core.models.exchange import Exchange
from app.core.models.industry import Industry
from app.core.models.stock_history import StockHistory
from app.core.utils.datetime_utils import DateTimeUtils
from app.database import database_manager

db = database_manager


class StockUtils:
	@staticmethod
	def get_stocks() -> list[dict[Any, Any]]:
		with db.get_session() as session:
			results = session.exec(select(Company)).all()
			result = [dict(row) for row in results]

		return result

	@staticmethod
	async def insert_prices(stocks_price_tuple: list[tuple[str, tuple[float, float]]]) -> None:
		with db.get_session() as session:
			for stock in stocks_price_tuple:
				stock_history = StockHistory(
					company_id=stock[0], buy=float(stock[1][0]), sell=float(stock[1][1])
				)
				session.add(stock_history)

	@staticmethod
	def get_newest_price_for_all_stocks() -> dict[str, dict[str, float]]:
		with db.get_session() as session:
			subquery = (
				select(
					StockHistory.company_id, func.max(StockHistory.timestamp).label("max_timestamp")
				)
				.group_by(StockHistory.company_id)
				.subquery()
			)

			stock_prices_query = (
				select(Company.ticker, StockHistory.buy, StockHistory.sell)
				.join(StockHistory, StockHistory.company_id == Company.id)  # type: ignore[arg-type]
				.join(
					subquery,
					and_(
						subquery.c.company_id == StockHistory.company_id,
						subquery.c.max_timestamp == StockHistory.timestamp,
					),
				)
			)

			stock_prices: Any = session.execute(stock_prices_query).all()

			return {stock.ticker: {"buy": stock.buy, "sell": stock.sell} for stock in stock_prices}

	@staticmethod
	def get_stock_details(session: Session, ticker: str) -> Row[Any] | None:
		query = (
			select(Company, Industry, Exchange)
			.join(Industry, Industry.id == Company.industry_id)  # type: ignore[arg-type]
			.join(Exchange, Exchange.id == Company.exchange_id)  # type: ignore[arg-type]
			.where(Company.ticker == ticker)
		)

		return session.execute(query).first()

	@staticmethod
	def get_stock_list(
		session: Session,
		industry: str | None = None,
		exchange: str | None = None,
		order_by: str | None = None,
		order: str | None = None,
		name: str | None = None,
		limit: int = 50,
		page: int = 1,
	) -> Sequence[Row[Any]]:
		query = (
			select(Company, Industry, Exchange)
			.join(Industry, Industry.id == Company.industry_id)  # type: ignore[arg-type]
			.join(Exchange, Exchange.id == Company.exchange_id)  # type: ignore[arg-type]
		)

		if order_by == "price":
			latest_timestamps = (
				select(
					StockHistory.company_id, func.max(StockHistory.timestamp).label("max_timestamp")
				)
				.group_by(StockHistory.company_id)
				.subquery()
			)

			latest_buy = (
				select(StockHistory.company_id, StockHistory.buy)
				.join(
					latest_timestamps,
					(StockHistory.company_id == latest_timestamps.c.company_id)  # type: ignore[arg-type]
					& (StockHistory.timestamp == latest_timestamps.c.max_timestamp),
				)
				.subquery()
			)

			query = query.join(
				latest_buy,
				Company.id == latest_buy.c.company_id,  # type: ignore[arg-type]
			)

			order_by_query = latest_buy.c.buy

		else:
			order_by_query = Company.name  # type: ignore[assignment]

		if order:
			order_by_query = order_by_query.desc() if order == "desc" else order_by_query.asc()  # type: ignore[assignment]

		if order_by:
			query = query.order_by(order_by_query)

		if industry:
			query = query.where(Industry.name == industry)

		if exchange:
			query = query.where(Exchange.name == exchange)

		if name:
			query = query.where(
				or_(
					or_(
						func.similarity(Company.name, name) > 0.6,
						func.similarity(Company.ticker, name) > 0.6,
					),
					or_(
						Company.name.ilike(f"%{name}%"),  # type: ignore[attr-defined]
						Company.ticker.ilike(f"%{name}%"),  # type: ignore[attr-defined]
					),
				)
			)

		query = query.limit(limit).offset((page - 1) * limit)

		return list(session.execute(query).all())

	@staticmethod
	def get_stock_prices(
		session: Session, ticker: str, period: str, group_period: str
	) -> Sequence[RowMapping]:
		stock = session.exec(select(Company).where(Company.ticker == ticker)).first()

		if not stock:
			raise TickerNotFoundError()

		time_threshold = DateTimeUtils.get_time_threshold(period)

		query = (
			select(
				func.date_trunc(UNIT_TIME[group_period], StockHistory.timestamp).label("timestamp"),
				func.min(StockHistory.buy)
				.over(
					partition_by=func.date_trunc(UNIT_TIME[group_period], StockHistory.timestamp),
					order_by=StockHistory.timestamp,  # type: ignore[arg-type]
				)
				.label("min"),
				func.max(StockHistory.buy)
				.over(
					partition_by=func.date_trunc(UNIT_TIME[group_period], StockHistory.timestamp),
					order_by=StockHistory.timestamp,  # type: ignore[arg-type]
				)
				.label("max"),
				func.first_value(StockHistory.buy)
				.over(
					partition_by=func.date_trunc(UNIT_TIME[group_period], StockHistory.timestamp),
					order_by=StockHistory.timestamp,  # type: ignore[arg-type]
				)
				.label("open"),
				func.last_value(StockHistory.buy)
				.over(
					partition_by=func.date_trunc(UNIT_TIME[group_period], StockHistory.timestamp),
					order_by=StockHistory.timestamp,  # type: ignore[arg-type]
				)
				.label("close"),
			)  # type: ignore
			.distinct(
				func.date_trunc(UNIT_TIME[group_period], StockHistory.timestamp).label("timestamp")
			)
			.where(
				StockHistory.company_id == stock.id,
				StockHistory.timestamp >= time_threshold,
			)
			.order_by(
				func.date_trunc(UNIT_TIME[group_period], StockHistory.timestamp),
				StockHistory.timestamp.desc(),  # type: ignore
			)
		)
		return session.execute(query).mappings().all()
