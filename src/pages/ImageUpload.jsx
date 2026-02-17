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

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
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
        setPreviewUrl(response.data.url);
        setSelectedImage(null);
        if (onUploadSuccess) onUploadSuccess(response.data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error.response?.data?.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your avatar?")) return;
    try {
      const response = await axiosInstance.delete("/api/upload/avatar");
      if (response.data.success) {
        setPreviewUrl("");
        setSelectedImage(null);
        if (onUploadSuccess) onUploadSuccess("");
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      alert("Error deleting avatar");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .iu-wrap { display: flex; flex-direction: column; height: 100%; }

        .iu-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #3a3e56;
          margin-bottom: 24px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Avatar preview */
        .iu-preview {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .iu-avatar {
          width: 100px; height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(99,102,241,0.3);
          box-shadow: 0 0 20px rgba(99,102,241,0.15);
        }
        .iu-avatar-placeholder {
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 2px dashed rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #2e3150;
        }

        /* File input */
        .iu-file-label {
          display: block;
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #3a3e56;
        }
        .iu-file-label:hover {
          border-color: rgba(99,102,241,0.35);
          background: rgba(99,102,241,0.05);
          color: #a5b4fc;
        }
        .iu-file-label span {
          display: block;
          font-size: 11px;
          margin-top: 3px;
          color: #2e3150;
        }
        .iu-file-input { display: none; }

        /* selected filename */
        .iu-selected {
          font-size: 12px;
          color: #6366f1;
          text-align: center;
          margin-bottom: 14px;
          padding: 6px 10px;
          background: rgba(99,102,241,0.08);
          border-radius: 8px;
          border: 1px solid rgba(99,102,241,0.15);
        }

        /* Buttons */
        .iu-btn-row { display: flex; gap: 10px; margin-top: auto; }

        .iu-btn-upload {
          flex: 1;
          background: #6366f1;
          border: none;
          color: #fff;
          padding: 12px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(99,102,241,0.25);
        }
        .iu-btn-upload:hover:not(:disabled) {
          background: #4f52e0;
          box-shadow: 0 4px 24px rgba(99,102,241,0.45);
          transform: translateY(-1px);
        }
        .iu-btn-upload:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .iu-btn-delete {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .iu-btn-delete:hover {
          background: rgba(248,113,113,0.15);
          border-color: rgba(248,113,113,0.4);
        }

        /* uploading animation */
        .iu-spinner {
          display: inline-block;
          width: 12px; height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 6px;
          vertical-align: middle;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="iu-wrap">
        <p className="iu-card-title" style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#3a3e56',
          marginBottom: '24px'
        }}>
          Profile Picture
        </p>

        {/* Preview */}
        <div className="iu-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar" className="iu-avatar" />
          ) : (
            <div className="iu-avatar-placeholder">👤</div>
          )}
        </div>

        {/* File input — custom styled */}
        <label className="iu-file-label">
          {selectedImage ? "✓ Image selected — ready to upload" : "Click to choose a photo"}
          <span>JPG, PNG, WEBP up to 5MB</span>
          <input
            className="iu-file-input"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </label>

        {/* Buttons */}
        <div className="iu-btn-row">
          <button
            className="iu-btn-upload"
            onClick={handleUpload}
            disabled={!selectedImage || uploading}
          >
            {uploading ? (
              <><span className="iu-spinner" />Uploading...</>
            ) : (
              "Upload Avatar"
            )}
          </button>

          {previewUrl && currentAvatar && (
            <button className="iu-btn-delete" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
}