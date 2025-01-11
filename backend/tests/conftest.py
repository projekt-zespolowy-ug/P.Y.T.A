# conftest.py
import asyncio
import os

import pytest

os.environ["TESTING"] = "true"


@pytest.fixture(scope="function")
def event_loop():
	"""
	Create an instance of the asyncio event loop
	Set scope to function to ensure clean state between tests
	"""
	policy = asyncio.get_event_loop_policy()
	loop = policy.new_event_loop()
	yield loop
	loop.close()


# Optional: Add pytest configuration
def pytest_configure(config):
	"""
	Set default asyncio fixture scope
	"""
	config.addinivalue_line(
		"markers", "asyncio: mark test as an async test to be run by pytest-asyncio"
	)
	# Explicitly set asyncio default fixture loop scope
	config.option.asyncio_mode = "auto"
