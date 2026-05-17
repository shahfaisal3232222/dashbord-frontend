import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import "../styles/auth.css";

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
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        navigate("/home");
        return;
      }

      setError(data?.message || "Invalid credentials");
    } catch (error) {
      console.error("Login Error:", error);
      setError(getApiErrorMessage(error, "Something went wrong. Try again later."));
    } finally {
      setLoading(false);
    }
  };

  return (
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
              placeholder="********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In ->"}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-footer">
          Don't have an account?{" "}
          <NavLink to="/register" className="auth-link">
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}
