import logging

from fastapi import APIRouter, HTTPException, Request

from app.core.exceptions import UserNotFoundError
from app.core.schemas.user_out import UserOut
from app.core.utils.querying_utils import QueryingUtils

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
