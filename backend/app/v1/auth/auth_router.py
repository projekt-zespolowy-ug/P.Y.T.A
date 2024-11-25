import logging

from fastapi import APIRouter, HTTPException, Request, Response

from app.core.exceptions import (
	EmailAlreadyExistsError,
	InvalidCredentialsError,
	UserCreationError,
	UserNotFoundError,
	UserNotLoggedInError,
)
from app.core.schemas.session_out import SessionOut
from app.core.schemas.user_login import UserLogin
from app.core.schemas.user_register import UserRegister
from app.core.utils.querying_utils import QueryingUtils

auth_router = APIRouter(prefix="/auth")

logger = logging.getLogger(__name__)


@auth_router.post("/register")
async def register(user: UserRegister, request: Request, response: Response) -> SessionOut:
	try:
		if not request.client:
			raise HTTPException(status_code=500, detail="User creation failed")

		new_session = QueryingUtils.register(user, request.client.host)

		response.set_cookie(key="session_id", value=new_session)
		return SessionOut(session_id=new_session)

	except UserCreationError as _:
		logger.error("Failed to create user", exc_info=True)
		raise HTTPException(status_code=500, detail="User creation failed") from None

	except EmailAlreadyExistsError as _:
		logger.error(f"User creation failed: {user.email} already exists")
		raise HTTPException(status_code=400, detail="Email already used") from None


@auth_router.post("/login")
async def login(user: UserLogin, request: Request, response: Response) -> SessionOut:
	try:
		if not request.client:
			raise HTTPException(status_code=500, detail="User login failed")

		new_session = QueryingUtils.login(user, request.client.host)

		response.set_cookie(key="session_id", value=new_session)
		return SessionOut(session_id=new_session)

	except InvalidCredentialsError as _:
		logger.info(f"Invalid credentials for {user.email}")
		raise HTTPException(status_code=404, detail="Invalid credentials") from None

	except UserNotFoundError as _:
		logger.info(f"User not found: {user.email}")
		raise HTTPException(status_code=404, detail="User not found") from None


@auth_router.post("/logout")
async def logout(request: Request, response: Response) -> dict[str, str]:
	try:
		session_id = request.cookies.get("session_id")

		if not session_id:
			raise UserNotLoggedInError

		QueryingUtils.logout(session_id)
		response.delete_cookie("session_id")
	except Exception as _:
		logger.error("Failed to logout", exc_info=True)

	return {"detail": "Logged out"}
