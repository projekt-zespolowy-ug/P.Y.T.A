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


def test_buy_order(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/buy",
			json={"amount": 1},
		)

		assert response.status_code == 200
		assert "amount" in response.json()
		assert "unit_price" in response.json()
		assert "timestamp" in response.json()
		assert "order_type" in response.json()
		assert response.json()["order_type"] == "buy"


def test_sell_order(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/sell",
			json={"amount": 1},
		)

		assert response.status_code == 200
		assert "amount" in response.json()
		assert "unit_price" in response.json()
		assert "timestamp" in response.json()
		assert "order_type" in response.json()
		assert response.json()["order_type"] == "sell"


def test_buy_order_insufficient_funds(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/buy",
			json={"amount": 100000},
		)

		assert response.status_code == 402
		assert "detail" in response.json()
		assert response.json()["detail"] == "Insufficient funds"


def test_buy_order_invalid_stock(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/INVALID/buy",
			json={"amount": 1},
		)

		assert response.status_code == 404
		assert "detail" in response.json()
		assert response.json()["detail"] == "Stock not found"


def test_sell_order_invalid_stock(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/INVALID/sell",
			json={"amount": 1},
		)

		assert response.status_code == 404
		assert "detail" in response.json()
		assert response.json()["detail"] == "Stock not found"


def test_sell_order_invalid_amount(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/sell",
			json={"amount": 100000},
		)

		assert response.status_code == 400
		assert "detail" in response.json()
		assert response.json()["detail"] == "Insufficient stocks"


def test_buy_no_login():
	with TestClient(app) as client:
		response = client.post(
			"/api/stocks/DOOR/buy",
			json={"amount": 1},
		)

		assert response.status_code == 401
		assert "detail" in response.json()
		assert response.json()["detail"] == "Unauthorized"


def test_buy_expired_token(register_user):
	with TestClient(app) as client:
		login_reposnse = client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		client.post(
			"/api/auth/logout",
		)

		client.cookies.set("session_id", login_reposnse.cookies["session_id"])

		response = client.post(
			"/api/stocks/DOOR/buy",
			json={"amount": 1},
		)

		assert response.status_code == 401
		assert "detail" in response.json()
		assert response.json()["detail"] == "Unauthorized"


def test_sell_not_bought_stock(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/sell",
			json={"amount": 1},
		)

		assert response.status_code == 400
		assert "detail" in response.json()
		assert response.json()["detail"] == "Insufficient stocks"


def test_sell_negative_amount(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/sell",
			json={"amount": -1},
		)

		assert response.status_code == 422


def test_sell_invalid_amount(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/sell",
			json={"amount": 0.000001},
		)
		assert response.status_code == 422

		response = client.post(
			"/api/stocks/DOOR/sell",
			json={"amount": 1.000001},
		)

		assert response.status_code == 422


def test_sell_valid_amount(register_user):
	with TestClient(app) as client:
		client.post(
			"/api/auth/login",
			json={"email": register_user["email"], "password": register_user["password"]},
		)

		response = client.post(
			"/api/stocks/DOOR/buy",
			json={"amount": 1.00001},
		)

		assert response.status_code == 200

		response = client.post(
			"/api/stocks/DOOR/sell",
			json={"amount": 0.00001},
		)

		assert response.status_code == 200

		transactions_res = client.get(
			"/api/user/transactions",
		)

		assert transactions_res.status_code == 200
		# looking at the tests above we have 4 successful transactions
		assert len(transactions_res.json()) == 4

		assert transactions_res.json()[0]["amount"] > 0
		assert transactions_res.json()[0]["unit_price"] > 0
		assert type(transactions_res.json()[0]["transaction_type"]) is str
