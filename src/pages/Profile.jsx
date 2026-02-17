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
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&display=swap');
          .prof-loading {
            min-height: 100vh;
            background: #080b12;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
          }
          .prof-loader-dots { display: flex; gap: 6px; }
          .prof-loader-dots span {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: #6366f1;
            animation: dotBounce 1.2s ease-in-out infinite;
          }
          .prof-loader-dots span:nth-child(2) { animation-delay: 0.2s; }
          .prof-loader-dots span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes dotBounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40%            { transform: scale(1);   opacity: 1; }
          }
        `}</style>
        <div className="prof-loading">
          <div className="prof-loader-dots">
            <span /><span /><span />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .prof-root {
          min-height: 100vh;
          background: #080b12;
          font-family: 'DM Sans', sans-serif;
          color: #e8eaf0;
          position: relative;
          overflow-x: hidden;
        }
        .prof-root::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .prof-root::after {
          content: '';
          position: fixed;
          bottom: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .prof-inner {
          position: relative;
          z-index: 1;
          max-width: 780px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* Header */
        .prof-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
          animation: fadeDown 0.6s ease both;
        }
        .prof-brand { display: flex; flex-direction: column; gap: 4px; }
        .prof-logo-row { display: flex; align-items: center; gap: 10px; }
        .prof-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 12px rgba(99,102,241,0.8);
          animation: pulse 2s ease-in-out infinite;
        }
        .prof-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #f1f2f6;
          letter-spacing: -0.5px;
        }
        .prof-subtitle {
          font-size: 13px;
          color: #5a5f7a;
          font-weight: 300;
          letter-spacing: 0.3px;
          padding-left: 18px;
        }

        .btn-back {
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
        .btn-back:hover {
          background: rgba(99,102,241,0.22);
          border-color: rgba(99,102,241,0.45);
          color: #c7d2fe;
        }

        /* Grid */
        .prof-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        @media (max-width: 620px) {
          .prof-grid { grid-template-columns: 1fr; }
        }

        /* Info Card */
        .prof-info-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          transition: border-color 0.2s;
        }
        .prof-info-card:hover { border-color: rgba(99,102,241,0.18); }

        .prof-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #3a3e56;
          margin-bottom: 24px;
        }

        .prof-field { margin-bottom: 20px; }
        .prof-field:last-child { margin-bottom: 0; }

        .prof-field-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #3a3e56;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .prof-field-value {
          font-size: 15px;
          color: #c8cad8;
          font-weight: 400;
        }

        .prof-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 16px 0;
        }

        /* Avatar Card */
        .prof-avatar-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          transition: border-color 0.2s;
        }
        .prof-avatar-card:hover { border-color: rgba(99,102,241,0.18); }

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
      `}</style>

      <div className="prof-root">
        <div className="prof-inner">

          {/* Header */}
          <div className="prof-header">
            <div className="prof-brand">
              <div className="prof-logo-row">
                <div className="prof-dot" />
                <h1 className="prof-title">My Profile</h1>
              </div>
              <p className="prof-subtitle">Manage your account settings</p>
            </div>
            <button className="btn-back" onClick={handleBackToTodos}>
              ← Back to Tasks
            </button>
          </div>

          {/* Grid */}
          <div className="prof-grid">

            {/* Info Card */}
            <div className="prof-info-card">
              <p className="prof-card-title">Account Info</p>

              <div className="prof-field">
                <p className="prof-field-label">Name</p>
                <p className="prof-field-value">{user?.name}</p>
              </div>

              <div className="prof-divider" />

              <div className="prof-field">
                <p className="prof-field-label">Email</p>
                <p className="prof-field-value">{user?.email}</p>
              </div>

              <div className="prof-divider" />

              <div className="prof-field">
                <p className="prof-field-label">Member Since</p>
                <p className="prof-field-value">
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Avatar Card */}
            <div className="prof-avatar-card">
              <ImageUpload
                currentAvatar={user?.avatar}
                onUploadSuccess={handleAvatarUpdate}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}