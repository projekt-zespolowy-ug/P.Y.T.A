import os

import pytest

from fastapi.testclient import TestClient

os.environ["TESTING"] = "true"

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


def test_stock_price():
	with TestClient(app) as client:
		response = client.get("/api/stocks/prices/DOOR", params={"period": "1d", "time_unit": "1m"})

		assert response.status_code == 200
		assert "timestamp" in response.json()
		assert "average_buy_price" in response.json()
		assert "average_sell_price" in response.json()
		assert "ticker" in response.json()


def test_stock_price_invalid_period():
	with TestClient(app) as client:
		response = client.get(
			"/api/stocks/prices/DOOR", params={"period": "1ddd", "time_unit": "1m"}
		)

		assert response.status_code == 400


def test_stock_price_invalid_time_unit():
	with TestClient(app) as client:
		response = client.get(
			"/api/stocks/prices/DOOR", params={"period": "1d", "time_unit": "1mmm"}
		)

		assert response.status_code == 400


def test_stock_price_ticker_not_found():
	with TestClient(app) as client:
		response = client.get(
			"/api/stocks/prices/DOORRR", params={"period": "1d", "time_unit": "1m"}
		)

		assert response.status_code == 404
