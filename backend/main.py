from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from the frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

class Todo(BaseModel):
    id: str = None  # Start with None
    title: str
    completed: bool = False
    user_id: Optional[str] = None

    def __init__(self, **data):
        super().__init__(**data)
        if self.id is None:  # Check if ID was provided
            self.id = uuid4().hex
            
class User(BaseModel):
    id: str = uuid4().hex
    name: str

# In-memory storage
todos: List[Todo] = []
users: List[User] = [
    User(id="1", name="John Doe"),
    User(id="2", name="Jane Smith"),
    User(id="3", name="Jane Smithsa"),
]

# API Endpoints
@app.get("/todos", response_model=List[Todo])
def get_todos():
    return todos

@app.post("/todos", response_model=Todo)
def create_todo(todo: Todo):
    todos.append(todo)
    return todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, todo_data: Todo):
    for todo in todos:
        if todo.id == todo_id:
            todo.title = todo_data.title
            todo.completed = todo_data.completed
            todo.user_id = todo_data.user_id
            return todo
    return None

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    global todos
    # Check if the todo exists
    todo_to_delete = next((todo for todo in todos if todo.id == todo_id), None)
    if todo_to_delete:
        todos = [todo for todo in todos if todo.id != todo_id]  # Keep todos that don't match the given id
        return {"message": "Todo deleted"}
    else:
        return {"message": "Todo not found"}, 404  # Return a 404 if the todo doesn't exist


@app.get("/users", response_model=List[User])
def get_users():
    return users