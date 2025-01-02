import os

import pytest

from fastapi.testclient import TestClient

os.environ["TESTING"] = "true"

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


def test_stock_list():
	with TestClient(app) as client:
		response = client.get("/api/stocks/?limit=25")

		assert response.status_code == 200
		assert "stocks" in response.json()
		assert "returned_count" in response.json()
		assert "is_last_page" in response.json()
		assert not response.json()["is_last_page"]
		assert len(response.json()["stocks"]) == 25


def test_stock_page():
	with TestClient(app) as client:
		response = client.get("/api/stocks/?limit=1")
		response_2 = client.get("/api/stocks/?limit=1&page=2")

		assert response.status_code == 200
		assert response_2.status_code == 200

		first_stock = response.json()["stocks"]
		second_stock = response_2.json()["stocks"]

		assert first_stock != second_stock


def test_stock_detail():
	with TestClient(app) as client:
		response = client.get("/api/stocks/DOOR")

		assert response.status_code == 200


def test_stock_detail_not_found():
	with TestClient(app) as client:
		response = client.get("/api/stocks/A")

		assert response.status_code == 404


def test_stock_websocket():
	with TestClient(app) as client:
		with client.websocket_connect("/api/stocks/updates/DOOR") as websocket:
			data = websocket.receive_json()

			assert "buy" in data
			assert "sell" in data
			assert isinstance(data["buy"], float)
			assert isinstance(data["sell"], float)
