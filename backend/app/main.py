import asyncio
import logging
import time

from collections.abc import AsyncGenerator, Awaitable, Callable
from typing import Any

from fastapi import FastAPI, Request
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.logger import configure_logging
from app.core.settings import Settings
from app.core.simulation.simulator import StockPriceManager
from app.core.utils.init_db import InitDB
from app.core.utils.translation_utils import get_possible_translation_languages
from app.v1 import auth_router, exchanges_router, industries_router, stocks_router, user_router

configure_logging()
setting = Settings()
available_translations = get_possible_translation_languages()

InitDB()

logging.getLogger("uvicorn.access").disabled = True
logger = logging.getLogger(__name__)

logging.info("settings: %s", setting.model_dump())
logging.info("available_translations: %s", available_translations)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[Any, Any]:  # pragma: no cover
	stock_manager = StockPriceManager()
	asyncio.create_task(stock_manager.generate_prices())
	app.state.stock_manager = stock_manager

	yield


def get_application() -> FastAPI:
	_app = FastAPI(title="P.Y.T.A", debug=setting.debug, root_path="/api", lifespan=lifespan)

	_app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	_app.include_router(auth_router)
	_app.include_router(stocks_router)
	_app.include_router(user_router)
	_app.include_router(industries_router)
	_app.include_router(exchanges_router)

	return _app


app = get_application()


@app.middleware("http")
async def set_locale(request: Request, call_next: Callable[[Request], Awaitable[Any]]) -> Any:
	locale = request.cookies.get("NEXT_LOCALE", "en")

	request.state.locale = "en" if locale not in available_translations else locale
	return await call_next(request)


@app.middleware("http")
async def log_requests(request: Request, call_next: Callable[[Request], Awaitable[Any]]) -> Any:
	if request.headers.get("CF-Connecting-IP"):  # pragma: no cover
		client = f"{request.headers.get('CF-Connecting-IP')}"
	elif not request.client:  # pragma: no cover
		client = "unknown"
	else:
		client = f"{request.client.host}:{request.client.port}"

	logger.info(f"I: {request.method} {request.url} {client}")

	start_time = time.time()
	response = await call_next(request)
	process_time = (time.time() - start_time) * 1000

	logger.info(f"C: {request.method} {request.url} [{response.status_code}] {process_time:.4f}ms")

	return response


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError) -> JSONResponse:
	errors = exc.errors()[0]

	details = {
		"loc": errors["loc"],
		"msg": errors["msg"],
		"type": errors["type"],
	}

	return JSONResponse(status_code=422, content={"detail": details})


if __name__ == "__main__":
	import uvicorn

	uvicorn.run("main:app", host="0.0.0.0", port=setting.port, reload=setting.debug)
