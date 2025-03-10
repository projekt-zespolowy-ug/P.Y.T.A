import logging

from typing import Any

from fastapi import APIRouter, HTTPException, Request
from fastapi.params import Depends

from app.core.exceptions import UserNotFoundError
from app.core.schemas.portfolio_out import PortfolioOut
from app.core.schemas.user_out import UserOut
from app.core.utils.query.portfolio_utils import PortfolioUtils
from app.core.utils.query.user_utils import UserUtils
from app.database import database_manager
from app.v1.stocks.stocks_router import get_user_from_token

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

		return UserUtils.get_user_info(session_id)

	except UserNotFoundError as _:
		logger.error(f"Invalid session. Session ID: {session_id}")
		raise HTTPException(status_code=404, detail="User not found") from None

	except Exception as _:
		logger.error(f"Unathorized. Cookie: {request.cookies}")
		raise HTTPException(status_code=401, detail="Unauthorized") from None


@user_router.get("/portfolio")
async def user_portfolio(
	request: Request,
	user: Any = Depends(get_user_from_token),
) -> list[PortfolioOut]:
	try:
		with database_manager.get_session() as session:
			portfolios = PortfolioUtils.get_user_portfolios(session, user["id"])

			return [
				PortfolioOut(
					name=portfolio.Company.name,
					ticker=portfolio.Company.ticker,
					amount=portfolio.Portfolio.amount,
					price=request.app.state.stock_manager[
						portfolio.Company.ticker
					].get_latest_price()["sell"],
				)
				for portfolio in portfolios
			]

	except Exception as error:  # pragma: no cover
		logger.error(error)
		raise HTTPException(status_code=500, detail="Failed to get portfolios") from None
