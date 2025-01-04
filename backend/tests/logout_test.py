import os

import pytest

from fastapi.testclient import TestClient

os.environ["TESTING"] = "true"

from app.main import app


@pytest.fixture
def client():
	return TestClient(app)


def test_logout(client):
	client.post(
		"/api/auth/register",
		json={
			"name": "test_name",
			"last_name": "test_last_name",
			"password": "test_password1A!",
			"email": "logout@test.com",
			"date_of_birth": "2000-01-01",
		},
	)
	response = client.post("/api/auth/logout")

	assert response.status_code == 200
	assert "session_id" not in response.cookies


def test_logout_no_user(client):
	response = client.post("/api/auth/logout")

	assert response.status_code == 200
	assert "session_id" not in response.cookies
