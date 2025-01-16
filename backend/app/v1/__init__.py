from app.v1.auth.auth_router import auth_router
from app.v1.exchanges.exchanges_router import exchanges_router
from app.v1.industries.industries_router import industries_router
from app.v1.stocks.stocks_router import stocks_router
from app.v1.user.user_router import user_router

__all__ = ["auth_router", "stocks_router", "user_router", "industries_router", "exchanges_router"]
