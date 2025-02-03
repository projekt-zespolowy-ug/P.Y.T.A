import logging

from fastapi import APIRouter, HTTPException, Request

from app.core.exceptions import UserNotFoundError
from app.core.schemas.portfolio_out import PortfolioOut
from app.core.schemas.user_out import UserOut
from app.core.utils.querying_utils import QueryingUtils
from app.database import database_manager

user_router = APIRouter(prefix="/user")

logger = logging.getLogger(__name__)


@user_router.get("/me")
async def user_info(request: Request) -> UserOut:
	try:
		if not request.client:  # pragma: no cover
			raise HTTPException(status_code=500, detail="User info failed")

		session_id = request.cookies.get("session_id")
		if not session_id:
			raise HTTPException(status_code=404, detail="User not found")

		return QueryingUtils.get_user_info(session_id)

	except UserNotFoundError as _:
		logger.error(f"Invalid session. Session ID: {session_id}")
		raise HTTPException(status_code=404, detail="User not found") from None

	except Exception as _:
		logger.error(f"Unathorized. Cookie: {request.cookies}")
		raise HTTPException(status_code=401, detail="Unauthorized") from None


@user_router.get("/portfolio")
async def user_portfolio(request: Request) -> list[PortfolioOut]:
	try:
		with database_manager.get_session() as session:
			if not request.client:  # pragma: no cover
				raise HTTPException(status_code=500, detail="User portfolio failed")

			session_id = request.cookies.get("session_id")
			if not session_id:
				raise HTTPException(status_code=401, detail="Unauthorized")

			portfolios = QueryingUtils.get_user_portfolios(session, session_id)

			return [
				PortfolioOut(
					name=portfolio.Company.name,
					ticker=portfolio.Company.ticker,
					amount=portfolio.Portfolio.amount,
					price=stock_from_memory.price_history[-1][1],
				)
				for portfolio in portfolios
				if (
					stock_from_memory := list(
						filter(
							lambda x: x.ticker == portfolio.Company.ticker,
							request.app.state.stock_manager.stocks,
						)
					)[0]
				)
			]

	except UserNotFoundError as error:
		logger.error(error)
		raise HTTPException(status_code=401, detail="Unauthorized") from None
