import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import "../styles/auth.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/user/register", { name, email, password });

      if (response.data.isSucess) {
        navigate("/");
        return;
      }

      setError(response.data.message || "Registration failed");
    } catch (error) {
      console.error(error);
      setError(getApiErrorMessage(error, "Something went wrong. Try again!"));
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Start organizing your tasks today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            {loading ? "Creating account..." : "Create Account ->"}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-footer">
          Already have an account?{" "}
          <NavLink to="/" className="auth-link">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}
