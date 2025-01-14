from fastapi import APIRouter, Request
from sqlmodel import select

from app.core.models.industry import Industry
from app.core.schemas.industry import Industry as IndustrySchema
from app.core.translate.translator import Translator
from app.database import database_manager

industries_router = APIRouter(prefix="/industries")


@industries_router.get("")
async def get_industries(request: Request) -> list[IndustrySchema]:
	with database_manager.get_session() as session:
		industries = session.exec(select(Industry)).all()

		t = Translator(request.state.locale, "industry").t

		return [
			IndustrySchema(name=industry.name, locale_name=t(industry.name))
			for industry in industries
		]
