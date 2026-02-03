import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";

export default function HomePage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/todos");
      setTodos(res.data.todos || []);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axiosInstance.post("/todos", { title });
      setTodos([res.data.todo, ...todos]);
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axiosInstance.put(`/todos/${id}`, {
        completed: !completed,
      });

      setTodos(
        todos.map((todo) =>
          todo._id === id ? res.data.todo : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const loadTodos = async () => {
      await fetchTodos();
    };

    loadTodos();
  }, [navigate]);
  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient- from-orange-100 to-orange-200 p-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📝 My Todos
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Add Todo */}
      <form
        onSubmit={addTodo}
        className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg flex gap-4"
      >
        <input
          type="text"
          placeholder="What do you need to do?"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Add
        </button>
      </form>

      {/* Todo List */}
      <div className="max-w-3xl mx-auto mt-6 space-y-4">
        {loading && (
          <p className="text-center text-gray-600">
            Loading todos...
          </p>
        )}

        {!loading && todos.length === 0 && (
          <p className="text-center text-gray-600">
            No todos yet. Add one 
          </p>
        )}

        {todos.map((todo) => (
          <div
            key={todo._id}
            className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  toggleTodo(todo._id, todo.completed)
                }
                className="w-5 h-5 accent-orange-500"
              />
              <span
                className={`text-lg ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {todo.title}
              </span>
            </div>

            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
