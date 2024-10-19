"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast" // Shadcn Toast Component
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // For delete confirmation
import { Toaster } from "@/components/ui/toaster";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

// API Base URL for FastAPI
const apiBaseUrl = "http://127.0.0.1:8000";

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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [selectedTodoToDelete, setSelectedTodoToDelete] = useState<string | null>(null); // For delete confirmation
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    fetchTodos();
    fetchUsers();
  }, []);
  
  const { toast } = useToast();

  // Validation and API fetching functions...
  const validateTitle = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title cannot be empty.",
        variant: "destructive",
      });
      return false;
    }
    if (/^\d/.test(title)) {
      toast({
        title: "Validation Error",
        description: "Title cannot start with a number.",
        variant: "destructive",
      });
      return false;
    }
    if (title.length > 100) {
      toast({
        title: "Validation Error",
        description: "Title cannot exceed 100 characters.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get<Todo[]>(`${apiBaseUrl}/todos`);
      setTodos(res.data);
    } catch (error) {
      toast({
        title: "Error fetching Todos",
        description: "There was an issue fetching the Todos. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${apiBaseUrl}/users`);
      setUsers(res.data);
    } catch (error) {
      toast({
        title: "Error fetching Users",
        description: "There was an issue fetching the users. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const createTodo = async () => {
    if (!validateTitle()) return; // Validate title before creating
    try {
      await axios.post<Todo>(`${apiBaseUrl}/todos`, { title, user_id: userId });
      fetchTodos();
      setTitle("");
      setUserId("");
      setIsModalOpen(false);
      toast({
        description: "Todo has been Added.",
      });
    } catch (error) {
      toast({
        title: "Error creating Todo",
        description: "Unable to create the Todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      try {
        await axios.put<Todo>(`${apiBaseUrl}/todos/${id}`, {
          ...todo,
          completed: !todo.completed,
        });
        fetchTodos();
      } catch (error) {
        toast({
          title: "Error updating Todo",
          description: "Unable to update the Todo. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const confirmDeleteTodo = (id: string) => {
    setSelectedTodoToDelete(id);
  };

  const deleteTodo = async () => {
    if (!selectedTodoToDelete) return;
    try {
      await axios.delete(`${apiBaseUrl}/todos/${selectedTodoToDelete}`);
      fetchTodos();
      toast({
        title: "Todo Deleted",
        variant: "destructive",
      });
      setSelectedTodoToDelete(null); // Close confirmation dialog
    } catch (error) {
      toast({
        title: "Error deleting Todo",
        description: "Unable to delete the Todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter todos based on completed status
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "uncompleted") return !todo.completed;
    return true; // "all" shows everything
  });
  const { setTheme } = useTheme();

  // Pagination logic
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
  
    <div className="container mx-auto p-4"><DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      <Toaster />
      <Card>
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>{filter === "all" ? "All Todos" : filter.charAt(0).toUpperCase() + filter.slice(1)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setFilter("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("completed")}>Completed</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setFilter("uncompleted")}>Uncompleted</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
          Add New Todo
        </Button>

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
            {currentTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{users.find((user) => user.id === todo.user_id)?.name || "Unassigned"}</td>
                <td>
                  <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
                </td>
                <td>
                  <Button onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                  <Button className="ml-2" onClick={() => confirmDeleteTodo(todo.id)} variant="destructive">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination Component */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === index + 1} 
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
                {userId ? users.find((user) => user.id === userId)?.name : "Select User"}
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
              <Button onClick={() => setIsModalOpen(false)} variant="destructive" className="ml-2">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {selectedTodoToDelete && (
        <Dialog open={!!selectedTodoToDelete} onOpenChange={() => setSelectedTodoToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this todo? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={deleteTodo}>Delete</Button>
              <Button onClick={() => setSelectedTodoToDelete(null)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Home;


