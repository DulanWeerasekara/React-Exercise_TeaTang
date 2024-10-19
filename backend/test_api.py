# test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app  # Adjust the import based on your file structure

client = TestClient(app)

def test_get_todos():
    response = client.get("/todos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)  # Ensure the response is a list

def test_create_todo():
    response = client.post("/todos", json={"title": "Test Todo"})
    assert response.status_code == 200
    assert response.json()["title"] == "Test Todo"

def test_update_todo():
    # Create a todo first
    response = client.post("/todos", json={"title": "Todo to Update"})
    todo_id = response.json()["id"]

    # Update the todo
    update_response = client.put(f"/todos/{todo_id}", json={"title": "Updated Todo", "completed": True})
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Todo"
    assert update_response.json()["completed"] is True

def test_delete_todo():
    # Create a todo first
    response = client.post("/todos", json={"title": "Todo to Delete"})
    todo_id = response.json()["id"]

    # Delete the todo
    delete_response = client.delete(f"/todos/{todo_id}")
    assert delete_response.status_code == 200
    assert delete_response.json() == {"message": "Todo deleted"}

    # Verify it has been deleted
    get_response = client.get("/todos")
    assert all(todo["id"] != todo_id for todo in get_response.json())
