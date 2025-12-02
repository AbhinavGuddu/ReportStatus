"use client";

import React, { useState, useEffect } from "react";

export default function DashboardHeader({
  currentSection,
  onSwitchSection,
  clientInfo,
  isEditMode,
  onStartEditing,
}) {
  const [currentTime, setCurrentTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentDate = mounted && currentTime ? currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }) : "Loading...";

  return (
    <header>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <h1 style={{ margin: 0 }}>📊 Combined Reports Status Dashboard</h1>
        {/* ADP Logo - using direct URL as in original */}
        <img
          src="https://1000logos.net/wp-content/uploads/2021/04/ADP-logo.png"
          alt="ADP Logo"
          style={{ height: "80px", width: "auto" }}
        />
      </div>
      <div className="date-info">{mounted ? currentDate : "Loading time..."}</div>
      <div className="client-container">
        <div className="client-info">Client: {clientInfo.client}</div>
        <div className="client-info">Env: {clientInfo.env}</div>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-container">
        <button
          className={`toggle-btn ${currentSection === "aws" ? "active" : ""}`}
          onClick={() => onSwitchSection("aws")}
        >
          🚀 AWS/NextGen
        </button>
        <button
          className={`toggle-btn ${currentSection === "dc" ? "active" : ""}`}
          onClick={() => onSwitchSection("dc")}
        >
          🏢 DC/Autopay
        </button>
        <button
          className={`toggle-btn ${isEditMode ? "active" : ""}`}
          onClick={onStartEditing}
          style={{ 
            backgroundColor: isEditMode ? '#4b5563' : '#6b7280',
            color: 'white',
            border: 'none'
          }}
        >
          ⚙️ Admin
        </button>
      </div>
    </header>
  );
}
