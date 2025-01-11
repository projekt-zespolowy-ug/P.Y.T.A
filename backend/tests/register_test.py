import pytest

from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


@pytest.fixture()
def user():
	return {
		"name": "test_name",
		"last_name": "test_last_name",
		"password": "test_password1A!",
		"email": "test@email.com",
		"date_of_birth": "2000-01-01",
	}


def test_register_success(client, user):
	response = client.post("/api/auth/register", json=user)

	assert response.status_code == 200


def test_register_email_already_exists(client, user):
	response = client.post("/api/auth/register", json=user)

	assert response.status_code == 400


def test_register_invalid_email(client, user):
	response = client.post("/api/auth/register", json=user.update({"email": "testemail.pl"}))

	assert response.status_code == 422


def test_register_invalid_password(client, user):
	response = client.post("/api/auth/register", json=user.update({"password": "testpassword"}))

	assert response.status_code == 422


def test_register_invalid_date_of_birth(client, user):
	response = client.post("/api/auth/register", json=user.update({"date_of_birth": "2024-01-01"}))

	assert response.status_code == 422


def test_register_invalid_name(client, user):
	response = client.post("/api/auth/register", json=user.update({"name": "i" * 40}))

	assert response.status_code == 422
