from fastapi import APIRouter, Request
from sqlmodel import Session, select

from app.core.models.auth import Auth

from app.core.models.session import Session as SessionModel
from app.core.models.user import User
from app.core.schemas.user_register import UserRegister
from app.database import engine

auth_router = APIRouter(prefix="/auth")


@auth_router.post("/register")
async def register(user: UserRegister, request: Request):
	with Session(engine) as session:
		if session.exec(select(Auth).where(Auth.email == user.email)).first():
			return {"message": "Email already exists"}

		new_auth = Auth(email=user.email, password=user.password)
		session.add(new_auth)

		auth = session.exec(select(Auth).where(Auth.email == user.email)).first()

		if not auth:
			return

		new_user = User(
			name=user.name,
			last_name=user.last_name,
			date_of_birth=user.date_of_birth,
			auth_id=auth.id,
		)
		session.add(new_user)

		client_host = "unknown"

		if request.client and request.client.host:
			client_host = request.client.host

		searched_user = session.exec(select(User).where(User.auth_id == auth.id)).first()

		if not searched_user:
			return

		new_session = SessionModel(user_id=searched_user.id, device_ip=client_host)
		session.add(new_session)
		session.commit()
