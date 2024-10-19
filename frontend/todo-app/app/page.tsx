"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// API Base URL for FastAPI
const apiBaseUrl = 'http://127.0.0.1:8000';

// Define Types for Todo and User
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id?: string;
}

interface User {
  id: string;
  name: string;
}

const Home: React.FC = () => {
  // State variables with types
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state

  // Fetch todos and users on mount
  useEffect(() => {
    fetchTodos();
    fetchUsers();
  }, []);

  // Fetch Todos from the FastAPI server
  const fetchTodos = async () => {
    const res = await axios.get<Todo[]>(`${apiBaseUrl}/todos`);
    setTodos(res.data);
  };

  // Fetch Users from the FastAPI server
  const fetchUsers = async () => {
    const res = await axios.get<User[]>(`${apiBaseUrl}/users`);
    setUsers(res.data);
  };

  // Create a new todo
  const createTodo = async () => {
    if (!title) return; // prevent creating empty todos
    await axios.post<Todo>(`${apiBaseUrl}/todos`, { title, user_id: userId });
    fetchTodos();
    setTitle('');
    setUserId('');
    setIsModalOpen(false); // Close modal after adding todo
  };

  // Toggle completion status of a todo
  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await axios.put<Todo>(`${apiBaseUrl}/todos/${id}`, {
        ...todo,
        completed: !todo.completed, // Toggle the completion status
      });
      fetchTodos(); // Refresh the list after toggling
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    await axios.delete(`${apiBaseUrl}/todos/${id}`);
    fetchTodos(); // Refresh the list after deleting
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        {/* Button to open the modal */}
      <Button className="mt-4" onClick={() => setIsModalOpen(true)}>Add New Todo</Button>


        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>User</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{users.find((user) => user.id === todo.user_id)?.name || 'Unassigned'}</td>
                <td>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                </td>
                <td>
                  <Button onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                  <Button className="ml-2" onClick={() => deleteTodo(todo.id)} variant="destructive">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Modal for adding new todo */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl mb-2">Add New Todo</h2>
            <Input
              placeholder="Todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2"
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                {userId ? users.find(user => user.id === userId)?.name : "Select User"}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {users.map((user) => (
                  <DropdownMenuItem key={user.id} onSelect={() => setUserId(user.id)}>
                    {user.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-4">
              <Button onClick={createTodo}>Add Todo</Button>
              <Button onClick={() => setIsModalOpen(false)} variant="destructive" className="ml-2">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
