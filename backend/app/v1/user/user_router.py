from fastapi import APIRouter, HTTPException, Request

from app.core.exceptions import UserNotFoundError
from app.core.schemas.user_out import UserOut
from app.core.utils.querying_utils import QueryingUtils

user_router = APIRouter(prefix="/user")


@user_router.get("/me")
async def user_info(request: Request) -> UserOut:
	try:
		if not request.client:
			raise HTTPException(status_code=500, detail="User info failed")

		session_id = request.cookies.get("session_id")
		if not session_id:
			raise HTTPException(status_code=404, detail="User not found")

		user = QueryingUtils.get_user_info(session_id)
		return user

	except UserNotFoundError as _:
		raise HTTPException(status_code=404, detail="User not found") from None

	except Exception as _:
		raise HTTPException(status_code=500, detail="User info failed") from None
