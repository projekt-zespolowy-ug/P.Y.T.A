import pytest

from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


@pytest.fixture()
def register_user():
	return {
		"name": "test_name",
		"last_name": "test_last_name",
		"password": "test_password1A!",
		"email": "register@email.com",
		"date_of_birth": "2000-01-01",
	}


def test_portfolio(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		client.post(
			"/api/stocks/DOOR/buy",
			json={"amount": 1},
		)

		response = client.get(
			"/api/user/portfolio/",
		)

		assert response.status_code == 200
		assert "name" in response.json()[0]
		assert "ticker" in response.json()[0]
		assert "amount" in response.json()[0]
		assert "price" in response.json()[0]


def test_portfolio_no_login():
	with TestClient(app) as client:
		response = client.get(
			"/api/user/portfolio/",
		)

		assert response.status_code == 401
		assert response.json() == {"detail": "Unauthorized"}


def test_portfolio_expired_token(register_user):
	with TestClient(app) as client:
		login_response = client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)
		client.post(
			"/api/auth/logout",
		)

		client.cookies.set("session_id", login_response.cookies["session_id"])

		response = client.get(
			"/api/user/portfolio/",
		)

		assert response.status_code == 401
		assert response.json() == {"detail": "Unauthorized"}
