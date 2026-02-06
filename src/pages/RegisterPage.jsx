import React from 'react'
import { NavLink , useNavigate} from 'react-router-dom'
import  { useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/user/register", {
        name,
        email,
        password,
      });

      if (response.data.isSuccess) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://story-pulse-omega.vercel.app/images/login.jpeg')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black-200 mb-8">
          Sign Up
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Your Name"
              className="w-full px-4 py-2 border rounded-lg "
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Field */}
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
              className="w-full px-4 py-2 border rounded-lg"
              required
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Sign Up
          </button>
          <p className="text-sm text-center text-black-600 mt-4">
            Already have an account?{" "}
            <NavLink to="/" className="text-indigo-600 hover:underline">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  )
}
