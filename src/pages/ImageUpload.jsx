import { useState } from "react";
import React from "react";
import axiosInstance from "../axiosInstance/axiosInstance";

export default function ImageUpload({ currentAvatar, onUploadSuccess }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || "");
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreviewUrl(base64String);
      setSelectedImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    setUploading(true);

    try {
      const response = await axiosInstance.post("/api/upload/avatar", {
        image: selectedImage,
      });

      if (response.data.success) {
        alert("Avatar uploaded successfully!");
        setPreviewUrl(response.data.url);
        setSelectedImage(null);

        if (onUploadSuccess) {
          onUploadSuccess(response.data.url);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error.response?.data?.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your avatar?")) {
      return;
    }

    try {
      const response = await axiosInstance.delete("/api/upload/avatar");

      if (response.data.success) {
        alert("Avatar deleted successfully!");
        setPreviewUrl("");
        setSelectedImage(null);

        if (onUploadSuccess) {
          onUploadSuccess("");
        }
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      alert("Error deleting avatar");
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Profile Picture
      </h2>

      {/* Preview */}
      <div className="mb-6 flex justify-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar Preview"
            className="w-40 h-40 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-lg">
            <span className="text-slate-400 text-5xl">👤</span>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="mb-4 block w-full text-sm text-slate-500
          file:mr-4 file:py-3 file:px-6
          file:rounded-xl file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100 cursor-pointer
          file:shadow-md file:transition"
      />

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!selectedImage || uploading}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold
            disabled:bg-gray-300 disabled:cursor-not-allowed
            transition shadow-md"
        >
          {uploading ? "Uploading..." : "Upload Avatar"}
        </button>

        {previewUrl && currentAvatar && (
          <button
            onClick={handleDelete}
            className="bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 rounded-xl font-semibold transition shadow-md"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}