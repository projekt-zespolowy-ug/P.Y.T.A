import pytest

from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


def test_exchange_list(client):
	response = client.get("/api/exchanges/")

	assert response.status_code == 200
	assert "name" in response.json()[0]
