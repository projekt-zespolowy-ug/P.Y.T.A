import asyncio
import logging
import time

from collections.abc import AsyncGenerator, Awaitable, Callable
from typing import Any

from fastapi import FastAPI, Request
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.core.logger import configure_logging
from app.core.settings import Settings
from app.core.simulation.simulator import StockPriceManager
from app.core.utils.init_db import InitDB
from app.v1.auth import auth_router
from app.v1.user import user_router

configure_logging()
setting = Settings()

InitDB()

logging.getLogger("uvicorn.access").disabled = True
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[Any, Any]:
	stock_manager = StockPriceManager()
	asyncio.create_task(stock_manager.generate_prices())

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
	_app.include_router(user_router)

	return _app


app = get_application()


@app.middleware("http")
async def log_requests(request: Request, call_next: Callable[[Request], Awaitable[Any]]) -> Any:
	if not request.client:
		client = "unknown"
	else:
		client = f"{request.client.host}:{request.client.port}"

	logger.info(f"I: {request.method} {request.url} {client}")

	start_time = time.time()
	response = await call_next(request)
	process_time = (time.time() - start_time) * 1000

	logger.info(f"C: {request.method} {request.url} [{response.status_code}] {process_time:.4f}ms")

	return response


if __name__ == "__main__":
	import uvicorn

	uvicorn.run("main:app", host="0.0.0.0", port=setting.port, reload=setting.debug)
