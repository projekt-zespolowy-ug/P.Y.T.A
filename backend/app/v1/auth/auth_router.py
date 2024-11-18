from fastapi import APIRouter, HTTPException, Request

from app.core.exceptions import EmailAlreadyExistsError, UserCreationError
from app.core.schemas.session_out import SessionOut
from app.core.schemas.user_register import UserRegister
from app.core.utils.querying_utils import QueryingUtils

auth_router = APIRouter(prefix="/auth")


@auth_router.post("/register")
async def register(user: UserRegister, request: Request) -> SessionOut:
	try:
		if not request.client:
			raise HTTPException(status_code=500, detail="User creation failed")
		new_session = QueryingUtils.register(user, request.client.host)
		return SessionOut(session_id=new_session)
	except UserCreationError as _:
		raise HTTPException(status_code=500, detail="User creation failed") from None
	except EmailAlreadyExistsError as _:
		raise HTTPException(status_code=400, detail="Email already used") from None
