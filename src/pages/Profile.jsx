import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";
import ImageUpload from "./ImageUpload";
export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/upload/profile");

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl) => {
    setUser({ ...user, avatar: newAvatarUrl });
  };

  const handleBackToTodos = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account settings</p>
        </div>

        <button
          onClick={handleBackToTodos}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition"
        >
          Back to Tasks
        </button>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* User Info */}
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-500 text-sm font-medium">
                Name
              </label>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {user?.name}
              </p>
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">
                Email
              </label>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {user?.email}
              </p>
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">
                Member Since
              </label>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Avatar Upload */}
        <div>
          <ImageUpload
            currentAvatar={user?.avatar}
            onUploadSuccess={handleAvatarUpdate}
          />
        </div>
      </div>
    </div>
  );
}