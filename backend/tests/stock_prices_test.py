import pytest

from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


def test_stock_price_invalid_period():
	with TestClient(app) as client:
		response = client.get(
			"/api/stocks/price/DOOR", params={"period": "d1ddd", "time_unit": "min"}
		)

		assert response.status_code == 422
		assert response.json() == {"detail": "Invalid period"}


def test_stock_price_invalid_time_unit():
	with TestClient(app) as client:
		response = client.get("/api/stocks/price/DOOR", params={"period": "1d", "time_unit": "mmm"})

		assert response.status_code == 422
		assert response.json() == {"detail": "Invalid time unit"}


def test_stock_price_ticker_not_found():
	with TestClient(app) as client:
		response = client.get(
			"/api/stocks/price/DOORRR", params={"period": "1d", "time_unit": "min"}
		)

		assert response.status_code == 404
		assert response.json() == {"detail": "Ticker not found"}
