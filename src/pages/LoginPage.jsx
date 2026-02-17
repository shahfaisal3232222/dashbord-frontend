import React from 'react';
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/user/login", { email, password });
      const data = response.data;
      if (data.isSuccess) {
        if (data?.token) localStorage.setItem("token", data.token);
        setLoading(false);
        navigate("/home");
      } else {
        setError(data?.message || "Invalid Credentials");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Try again later!");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #080b12;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .auth-root::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-root::after {
          content: '';
          position: fixed;
          bottom: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 44px 40px;
          animation: fadeUp 0.6s ease both;
        }

        .auth-top {
          text-align: center;
          margin-bottom: 36px;
        }

        .auth-dot-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .auth-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 12px rgba(99,102,241,0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        .auth-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #f1f2f6;
          letter-spacing: -0.5px;
        }
        .auth-sub {
          font-size: 13px;
          color: #3a3e56;
          font-weight: 300;
          margin-top: 4px;
        }

        .auth-error {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #fca5a5;
          text-align: center;
          margin-bottom: 20px;
          animation: fadeUp 0.3s ease both;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #3a3e56;
          font-weight: 500;
        }

        .auth-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #e8eaf0;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
        }
        .auth-input::placeholder { color: #2e3150; }
        .auth-input:focus {
          border-color: rgba(99,102,241,0.45);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }

        .auth-btn {
          background: #6366f1;
          border: none;
          color: #fff;
          padding: 14px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
          margin-top: 4px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
          width: 100%;
        }
        .auth-btn:hover:not(:disabled) {
          background: #4f52e0;
          box-shadow: 0 4px 28px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }
        .auth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 8px 0;
        }

        .auth-footer {
          text-align: center;
          font-size: 13px;
          color: #3a3e56;
          margin-top: 20px;
        }
        .auth-link {
          color: #a5b4fc;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .auth-link:hover { color: #c7d2fe; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.8); }
          50%       { box-shadow: 0 0 18px rgba(99,102,241,1); }
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-top">
            <div className="auth-dot-row">
              <div className="auth-dot" />
            </div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to your account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="auth-divider" style={{ marginTop: '24px' }} />

          <p className="auth-footer">
            Don't have an account?{" "}
            <NavLink to="/register" className="auth-link">Create one</NavLink>
          </p>
        </div>
      </div>
    </>
  );
}