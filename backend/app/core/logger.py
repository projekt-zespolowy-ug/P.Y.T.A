import logging
import logging.config
import os

from datetime import datetime


class DynamicFileHandler(logging.FileHandler):
	def __init__(self, base_filename, *args, **kwargs):
		timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
		filename = f"{base_filename}_{timestamp}.log"
		super().__init__(filename, *args, **kwargs)


os.makedirs("logs", exist_ok=True)

# Modify the logging configuration
LOGGING_CONFIG = {
	"version": 1,
	"disable_existing_loggers": False,
	"formatters": {
		"standard": {
			"format": "%(asctime)s-%(name)-25s [%(levelname)-6s]: %(message)s",
			"use_colors": True,
		},
	},
	"handlers": {
		"console": {"class": "logging.StreamHandler", "formatter": "standard", "level": "INFO"},
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


def configure_logging():
	logging.config.dictConfig(LOGGING_CONFIG)
