from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
	app_name: str = "P.Y.T.A"
	port: int = 8000
	db_host: str = "localhost"
	debug: bool = False
	db_port: int = 5432
	db_user: str = "postgres"
	db_password: str = "example"

	logs_amount_to_keep: int = 1

	simulation_step_time_s: float = 1
	simulation_time_error_threshold_s: float = 0.100
	simulation_database_snapshot_time_s: float = 60 * 15
	simulation_lookback_amount: float = (
		simulation_database_snapshot_time_s // simulation_step_time_s
	)

	model_config = SettingsConfigDict(env_file=".env.local")
