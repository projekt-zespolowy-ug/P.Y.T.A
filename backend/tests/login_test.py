import os

import pytest

from fastapi.testclient import TestClient

os.environ["TESTING"] = "true"

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


def test_login_success(client, register_user):
	response = client.post("/api/auth/register", json=register_user)

	assert response.status_code == 200

	response = client.post(
		"/api/auth/login",
		json={"email": register_user["email"], "password": register_user["password"]},
	)

	assert response.status_code == 200
	assert "session_id" in response.cookies


def test_login_invalid_password(client, register_user):
	response = client.post(
		"/api/auth/login",
		json={"email": register_user["email"], "password": "invalid_password"},
	)

	assert response.status_code == 404
	assert "session_id" not in response.cookies


def test_login_invalid_email(client, register_user):
	response = client.post(
		"/api/auth/login",
		json={"email": "invalid@email.com", "password": register_user["password"]},
	)

	assert response.status_code == 404
