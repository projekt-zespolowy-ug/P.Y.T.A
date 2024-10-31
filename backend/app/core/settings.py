from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "P.Y.T.A"
    port: int = 8000
    db_host: str = "localhost"
    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env.local")
