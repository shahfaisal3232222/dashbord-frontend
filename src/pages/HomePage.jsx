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
      const res = await axiosInstance.get("/api/todos");
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
      const res = await axiosInstance.post("/api/todos", { title });
      setTodos([res.data.todo, ...todos]);
      setTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axiosInstance.put(`/api/todos/${id}`, {
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
      await axiosInstance.delete(`/api/todos/${id}`);
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
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-6">
    
    {/* Header */}
    <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          My Tasks
        </h1>
        <p className="text-slate-500 mt-1">
          Organize your day efficiently
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition"
      >
        Logout
      </button>
    </div>

    {/* Add Todo Card */}
    <form
      onSubmit={addTodo}
      className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex gap-4"
    >
      <input
        type="text"
        placeholder="Add a new task..."
        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        type="submit"
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-3 rounded-xl font-semibold shadow-md transition"
      >
        Add Task
      </button>
    </form>

    {/* Todo List */}
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      {loading && (
        <p className="text-center text-slate-500">
          Loading your tasks...
        </p>
      )}

      {!loading && todos.length === 0 && (
        <div className="text-center text-slate-500 bg-white p-6 rounded-xl shadow">
          No tasks yet. Start by adding one ✨
        </div>
      )}

      {todos.map((todo) => (
        <div
          key={todo._id}
          className="bg-white p-5 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition"
        >
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                toggleTodo(todo._id, todo.completed)
              }
              className="w-5 h-5 accent-indigo-500"
            />

            <span
              className={`text-lg ${
                todo.completed
                  ? "line-through text-gray-400"
                  : "text-slate-800"
              }`}
            >
              {todo.title}
            </span>
          </div>

          <button
            onClick={() => deleteTodo(todo._id)}
            className="text-rose-500 hover:text-rose-700 font-medium transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
);

}
