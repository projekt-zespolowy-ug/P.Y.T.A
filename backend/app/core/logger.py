import logging
import logging.config
import os

from datetime import datetime
from typing import Any

from app.core.settings import Settings

settings = Settings()


class DynamicFileHandler(logging.FileHandler):
	def __init__(self, base_filename: str, *args: Any, **kwargs: Any) -> None:
		timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
		filename = f"{base_filename}_{timestamp}.log"
		super().__init__(filename, *args, **kwargs)

		self.delete_old_logs(amount_to_keep=settings.logs_amount_to_keep)

	def delete_old_logs(self, amount_to_keep: int = 0) -> None:
		assert amount_to_keep >= 0, "Amount to keep must be non-negative"

		if amount_to_keep == 0:
			return

		log_files = sorted(
			os.listdir("logs"),
			key=lambda x: os.path.getmtime(os.path.join("logs", x)),
			reverse=True,
		)

		for log_file in log_files[amount_to_keep:]:
			os.remove(os.path.join("logs", log_file))


os.makedirs("logs", exist_ok=True)

LOGGING_CONFIG = {
	"version": 1,
	"disable_existing_loggers": False,
	"formatters": {
		"standard": {
			"format": "%(asctime)s-%(name)-25s [%(levelname)-6s]: %(message)s",
			"use_colors": True,
		},
		"rich": {
			"format": "%(name)s - %(message)s",
			"datefmt": "[%X]",
		},
	},
	"handlers": {
		"console": {
			"class": "rich.logging.RichHandler",
			"formatter": "rich",
			"level": "INFO",
		},
		"file": {
			"()": DynamicFileHandler,
			"base_filename": "logs/pyta",
			"formatter": "standard",
			"level": "INFO",
		},
	},
	"loggers": {
		"": {
			"handlers": ["console", "file"],
			"level": "INFO",
			"propagate": True,
		},
		"uvicorn": {"handlers": ["file", "console"], "level": "INFO", "propagate": False},
	},
}


def configure_logging() -> None:
	logging.config.dictConfig(LOGGING_CONFIG)
