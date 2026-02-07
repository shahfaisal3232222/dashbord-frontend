import React from 'react'
import { useState } from "react";
import { NavLink , useNavigate} from "react-router-dom";
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
      const response = await axiosInstance.post("/api/user/login", {
     email , password
      });

      const data =  response.data;
      // console.log("API Response:", data);

     if (data.isSuccess) {
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }
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
    <div>
         <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{ 
        backgroundImage:
          "url('https://story-pulse-omega.vercel.app/images/login.jpeg')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black-200 mb-8">
          Login
        </h2>

        {/* Show Error */}
        {error && (
          <p className="text-red-600 text-center mb-3 font-medium">{error}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg "
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-200"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <NavLink to="/register" className="text-indigo-600 hover:underline">
              Sign Up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
    </div>
  )
}
