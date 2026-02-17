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
      setTodos(todos.map((todo) => (todo._id === id ? res.data.todo : todo)));
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

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hp-root {
          min-height: 100vh;
          background: #080b12;
          font-family: 'DM Sans', sans-serif;
          color: #e8eaf0;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Ambient background glows ── */
        .hp-root::before {
          content: '';
          position: fixed;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hp-root::after {
          content: '';
          position: fixed;
          bottom: -150px;
          right: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .hp-inner {
          position: relative;
          z-index: 1;
          max-width: 780px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* ── Header ── */
        .hp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
          animation: fadeDown 0.6s ease both;
        }

        .hp-brand {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hp-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hp-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 12px rgba(99,102,241,0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        .hp-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #f1f2f6;
        }

        .hp-subtitle {
          font-size: 13px;
          color: #5a5f7a;
          font-weight: 300;
          letter-spacing: 0.3px;
          padding-left: 18px;
        }

        .hp-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .btn-ghost {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #9094a8;
          padding: 9px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.2px;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          color: #c8cad8;
          border-color: rgba(255,255,255,0.14);
        }

        .btn-profile {
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc;
          padding: 9px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-profile:hover {
          background: rgba(99,102,241,0.22);
          border-color: rgba(99,102,241,0.45);
          color: #c7d2fe;
        }

        /* ── Stats Row ── */
        .hp-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 32px;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(99,102,241,0.2);
        }

        .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #3e4259;
          font-weight: 500;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #f1f2f6;
          line-height: 1;
        }

        .stat-value.accent { color: #6366f1; }
        .stat-value.green  { color: #34d399; }

        /* ── Progress Bar ── */
        .hp-progress-wrap {
          margin-bottom: 32px;
          animation: fadeUp 0.6s 0.15s ease both;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .progress-label {
          font-size: 12px;
          color: #3e4259;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 500;
        }
        .progress-pct {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #6366f1;
        }
        .progress-track {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 0 10px rgba(99,102,241,0.5);
        }

        /* ── Add Task Form ── */
        .hp-form {
          display: flex;
          gap: 10px;
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hp-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #e8eaf0;
          outline: none;
          transition: all 0.2s ease;
        }
        .hp-input::placeholder { color: #3a3e56; }
        .hp-input:focus {
          border-color: rgba(99,102,241,0.45);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }

        .btn-add {
          background: #6366f1;
          border: none;
          color: #fff;
          padding: 13px 24px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        }
        .btn-add:hover {
          background: #4f52e0;
          box-shadow: 0 4px 28px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }
        .btn-add:active { transform: translateY(0); }

        /* ── Section label ── */
        .section-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #3a3e56;
          font-weight: 500;
          margin-bottom: 14px;
          animation: fadeUp 0.6s 0.25s ease both;
        }

        /* ── Todo List ── */
        .hp-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .todo-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
          cursor: default;
        }
        .todo-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(99,102,241,0.18);
          transform: translateX(2px);
        }
        .todo-item.completed {
          opacity: 0.45;
        }

        .todo-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }

        /* Custom checkbox */
        .todo-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 1.5px solid rgba(99,102,241,0.35);
          background: transparent;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          flex-shrink: 0;
          position: relative;
          transition: all 0.15s ease;
        }
        .todo-checkbox:checked {
          background: #6366f1;
          border-color: #6366f1;
          box-shadow: 0 0 10px rgba(99,102,241,0.4);
        }
        .todo-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 9px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        .todo-checkbox:hover:not(:checked) {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.08);
        }

        .todo-text {
          font-size: 14px;
          color: #c8cad8;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s;
        }
        .todo-text.done {
          text-decoration: line-through;
          color: #3a3e56;
        }

        .btn-delete {
          background: none;
          border: none;
          color: #2e3150;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 0.15s ease;
          flex-shrink: 0;
          line-height: 1;
        }
        .btn-delete:hover {
          color: #f87171;
          background: rgba(248,113,113,0.1);
        }

        /* ── Empty State ── */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #2e3150;
        }
        .empty-icon {
          font-size: 40px;
          margin-bottom: 14px;
          opacity: 0.4;
        }
        .empty-text {
          font-size: 14px;
          color: #3a3e56;
          font-weight: 300;
        }

        /* ── Loading ── */
        .loading-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 48px 0;
          color: #3a3e56;
          font-size: 13px;
        }
        .loader-dots {
          display: flex;
          gap: 4px;
        }
        .loader-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6366f1;
          animation: dotBounce 1.2s ease-in-out infinite;
        }
        .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loader-dots span:nth-child(3) { animation-delay: 0.4s; }

        /* ── Divider ── */
        .hp-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 32px 0;
        }

        /* ── Animations ── */
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.8); }
          50%       { box-shadow: 0 0 18px rgba(99,102,241,1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }

        /* ── Responsive ── */
        @media (max-width: 520px) {
          .hp-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .stat-value { font-size: 20px; }
          .hp-title { font-size: 22px; }
          .hp-form { flex-direction: column; }
          .btn-add { width: 100%; }
        }
      `}</style>

      <div className="hp-root">
        <div className="hp-inner">

          {/* ── Header ── */}
          <div className="hp-header">
            <div className="hp-brand">
              <div className="hp-logo-row">
                <div className="hp-logo-dot" />
                <h1 className="hp-title">My Tasks</h1>
              </div>
              <p className="hp-subtitle">Stay focused. Ship things.</p>
            </div>

            <div className="hp-actions">
              <button className="btn-profile" onClick={() => navigate("/profile")}>
                Profile
              </button>
              <button className="btn-ghost" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="hp-stats">
            <div className="stat-card">
              <span className="stat-label">Total</span>
              <span className="stat-value accent">{totalCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Done</span>
              <span className="stat-value green">{completedCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Left</span>
              <span className="stat-value">{totalCount - completedCount}</span>
            </div>
          </div>

          {/* ── Progress ── */}
          {totalCount > 0 && (
            <div className="hp-progress-wrap">
              <div className="progress-header">
                <span className="progress-label">Progress</span>
                <span className="progress-pct">{progressPct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          <div className="hp-divider" />

          {/* ── Add Task ── */}
          <form className="hp-form" onSubmit={addTodo}>
            <input
              className="hp-input"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="btn-add" type="submit">
              + Add Task
            </button>
          </form>

          {/* ── List ── */}
          {!loading && todos.length > 0 && (
            <p className="section-label">
              {completedCount === totalCount && totalCount > 0
                ? "All tasks completed 🎉"
                : `${totalCount - completedCount} task${totalCount - completedCount !== 1 ? "s" : ""} remaining`}
            </p>
          )}

          <div className="hp-list">
            {loading && (
              <div className="loading-row">
                <div className="loader-dots">
                  <span /><span /><span />
                </div>
                Loading tasks...
              </div>
            )}

            {!loading && todos.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <p className="empty-text">No tasks yet. Add one above to get started.</p>
              </div>
            )}

            {todos.map((todo) => (
              <div
                key={todo._id}
                className={`todo-item${todo.completed ? " completed" : ""}`}
              >
                <div className="todo-left">
                  <input
                    className="todo-checkbox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id, todo.completed)}
                  />
                  <span className={`todo-text${todo.completed ? " done" : ""}`}>
                    {todo.title}
                  </span>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => deleteTodo(todo._id)}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}