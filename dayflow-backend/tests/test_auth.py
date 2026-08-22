import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_signup(client: AsyncClient):
    response = await client.post("/api/v1/auth/signup", json={
        "employee_id": "EMP001",
        "email": "test@example.com",
        "password": "password123",
        "role": "employee"
    })
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_login(client: AsyncClient):
    await client.post("/api/v1/auth/signup", json={
        "employee_id": "EMP002",
        "email": "login@example.com",
        "password": "password123",
        "role": "employee"
    })
    response = await client.post("/api/v1/auth/login", json={
        "email": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
