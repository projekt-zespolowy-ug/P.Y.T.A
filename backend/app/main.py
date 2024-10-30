from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.settings import Settings


setting = Settings()


def get_application():
    _app = FastAPI(title="P.Y.T.A", debug=setting.debug)

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return _app


app = get_application()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=setting.port, reload=setting.debug)
