from collections.abc import Sequence
from typing import Any

from sqlalchemy import Row
from sqlmodel import Session, and_, select

from app.core.models.company import Company
from app.core.models.portfolio import Portfolio
from app.database import database_manager

db = database_manager


class PortfolioUtils:
	@staticmethod
	def get_or_create_portfolio(session: Session, user_id: str, company_id: str) -> Portfolio:
		if portfolio := session.exec(
			select(Portfolio).where(
				and_(Portfolio.user_id == user_id, Portfolio.company_id == company_id)
			)
		).first():
			return portfolio

		new_portfolio = Portfolio(user_id=user_id, company_id=company_id, amount=0)
		session.add(new_portfolio)
		return new_portfolio

	@staticmethod
	def update_user_portfolio(
		session: Session, user_id: str, company_id: str, amount: float, buy: bool
	) -> None:
		portfolio = PortfolioUtils.get_or_create_portfolio(session, user_id, company_id)

		portfolio.amount += amount if buy else -amount

		session.add(portfolio)

	@staticmethod
	def get_user_portfolio(session: Session, user_id: str, stock_id: str) -> Portfolio | None:
		query = select(Portfolio).where(
			and_(Portfolio.user_id == user_id, Portfolio.company_id == stock_id)
		)

		return session.exec(query).one_or_none()

	@staticmethod
	def get_user_portfolios(session: Session, user_id: str) -> Sequence[Row[Any]]:
		query = (
			select(
				Portfolio,
				Company,
			)
		).where(
			Portfolio.user_id == user_id,
			Portfolio.company_id == Company.id,
			Portfolio.amount > 0,
		)
		return session.execute(query).all()
