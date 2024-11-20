import logging
import logging.config
import os

from datetime import datetime


class DynamicFileHandler(logging.FileHandler):
	def __init__(self, base_filename, *args, **kwargs):
		timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
		filename = f"{base_filename}_{timestamp}.log"
		super().__init__(filename, *args, **kwargs)


<<<<<<< HEAD
=======
# Create logs directory
>>>>>>> origin/feat/backend-logging
os.makedirs("logs", exist_ok=True)

# Modify the logging configuration
LOGGING_CONFIG = {
	"version": 1,
	"disable_existing_loggers": False,
	"formatters": {
<<<<<<< HEAD
		"standard": {
			"format": "%(asctime)s-%(name)-25s [%(levelname)-6s]: %(message)s",
			"use_colors": True,
		},
=======
		"standard": {"format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"},
>>>>>>> origin/feat/backend-logging
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
<<<<<<< HEAD
		"uvicorn": {"handlers": ["file", "console"], "level": "INFO", "propagate": False},
=======
		"uvicorn": {"handlers": ["console", "file"], "level": "INFO", "propagate": False},
>>>>>>> origin/feat/backend-logging
	},
}


def configure_logging():
	logging.config.dictConfig(LOGGING_CONFIG)
