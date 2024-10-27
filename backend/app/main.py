from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import db

db.connect()


def get_application():
    _app = FastAPI(title="P.Y.T.A")

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return _app


app = get_application()
