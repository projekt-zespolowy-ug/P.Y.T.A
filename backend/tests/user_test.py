import pytest

from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


def test_user_me():
	with TestClient(app) as client:
		register_res = client.post(
			"/api/auth/register",
			json={
				"name": "test_name",
				"last_name": "test_last_name",
				"password": "test_password1A!",
				"email": "user_me@test.com",
				"date_of_birth": "2000-01-01",
			},
		)

		session_id = register_res.cookies["session_id"]

		assert register_res.status_code == 200

		response = client.get("/api/user/me", cookies={"session_id": session_id})

		assert response.status_code == 200
		assert "balance" in response.json()
		assert "first_name" in response.json()
		assert "last_name" in response.json()
		assert "hashed_email" in response.json()


def test_user_me_not_logged_in():
	with TestClient(app) as client:
		response = client.get("/api/user/me")

		assert response.status_code == 401


def test_user_me_invalid_session():
	with TestClient(app) as client:
		response = client.get("/api/user/me", cookies={"session_id": "invalid"})

		assert response.status_code == 404
