import pytest

from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


def test_industries_list(client):
	response = client.get("/api/industries")

	client.cookies["NEXT_LOCALE"] = "en"

	assert response.status_code == 200
	assert "name" in response.json()[0]
	assert "locale_name" in response.json()[0]
