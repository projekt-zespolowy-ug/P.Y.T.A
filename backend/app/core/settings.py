from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
	app_name: str = "P.Y.T.A"
	port: int = 8000
	db_host: str = "localhost"
	debug: bool = False
	db_port: int = 5432
	db_user: str = "postgres"
	db_password: str = "example"

	model_config = SettingsConfigDict(env_file=".env.local")
