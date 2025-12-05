"use client";

import React, { useState, useEffect } from "react";

export default function DashboardHeader({
  currentSection,
  onSwitchSection,
  clientInfo,
  isEditMode,
  isTestingMode,
  onStartEditing,
  onToggleTesting,
  currentUser,
  onLogout,
  onShowUserManagement,
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
    <header style={{
      background: 'linear-gradient(135deg, #1e5799 0%, #207cca 100%)',
      color: 'white',
      padding: window.innerWidth <= 768 ? '10px' : '15px',
      borderRadius: '10px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "5px",
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          gap: window.innerWidth <= 768 ? '10px' : '0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <h1 style={{ 
            margin: 0,
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '22px' : '28px',
            textAlign: window.innerWidth <= 768 ? 'center' : 'left'
          }}>📊 Combined Reports Status Dashboard</h1>
          {currentUser && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>👤 {currentUser.name}</span>
              <span style={{
                background: currentUser.role === 'admin' ? '#dc2626' : currentUser.role === 'co-admin' ? '#f59e0b' : '#10b981',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '10px'
              }}>
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        {/* ADP Logo - using direct URL as in original */}
        <img
          src="https://1000logos.net/wp-content/uploads/2021/04/ADP-logo.png"
          alt="ADP Logo"
          style={{ 
            height: window.innerWidth <= 480 ? '50px' : window.innerWidth <= 768 ? '60px' : '80px',
            width: 'auto'
          }}
        />
      </div>
      <div style={{
        fontSize: window.innerWidth <= 480 ? '14px' : '16px',
        opacity: 0.9,
        textAlign: window.innerWidth <= 768 ? 'center' : 'left'
      }}>{mounted ? currentDate : "Loading time..."}</div>
      <div style={{
        display: 'flex',
        justifyContent: window.innerWidth <= 768 ? 'center' : 'space-between',
        alignItems: 'center',
        marginTop: '5px',
        gap: '10px',
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
      }}>
        <div style={{
          backgroundColor: '#e8f4fc',
          padding: window.innerWidth <= 480 ? '8px 12px' : '10px 15px',
          borderRadius: '5px',
          display: 'inline-block',
          fontWeight: '500',
          color: '#1e5799',
          fontSize: window.innerWidth <= 480 ? '12px' : '14px'
        }}>Client: {clientInfo.client}</div>
        <div style={{
          backgroundColor: '#e8f4fc',
          padding: window.innerWidth <= 480 ? '8px 12px' : '10px 15px',
          borderRadius: '5px',
          display: 'inline-block',
          fontWeight: '500',
          color: '#1e5799',
          fontSize: window.innerWidth <= 480 ? '12px' : '14px'
        }}>Env: {clientInfo.env}</div>
      </div>

      {/* Toggle Buttons */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '10px',
        borderRadius: '10px',
        marginTop: '15px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
        gap: window.innerWidth <= 480 ? '8px' : '5px',
        justifyContent: 'center'
      }}>
        <button
          style={{
            background: currentSection === "aws" ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)',
            color: currentSection === "aws" ? '#1e5799' : 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: window.innerWidth <= 480 ? '10px' : '10px 30px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            fontWeight: currentSection === "aws" ? 'bold' : '600',
            transition: 'all 0.3s ease',
            width: window.innerWidth <= 480 ? '100%' : 'auto'
          }}
          onClick={() => onSwitchSection("aws")}
        >
          {window.innerWidth <= 480 ? '🚀' : '🚀 AWS/NextGen'}
        </button>
        <button
          style={{
            background: currentSection === "dc" ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)',
            color: currentSection === "dc" ? '#1e5799' : 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: window.innerWidth <= 480 ? '10px' : '10px 30px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            fontWeight: currentSection === "dc" ? 'bold' : '600',
            transition: 'all 0.3s ease',
            width: window.innerWidth <= 480 ? '100%' : 'auto'
          }}
          onClick={() => onSwitchSection("dc")}
        >
          {window.innerWidth <= 480 ? '🏢' : '🏢 DC/Autopay'}
        </button>

        <button
          style={{
            background: isTestingMode ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: window.innerWidth <= 480 ? '10px' : '10px 30px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            fontWeight: isTestingMode ? 'bold' : '600',
            transition: 'all 0.3s ease',
            width: window.innerWidth <= 480 ? '100%' : 'auto'
          }}
          onClick={onToggleTesting}
        >
          {window.innerWidth <= 480 ? '🧪' : `🧪 ${isTestingMode ? 'Testing ON' : 'Testing OFF'}`}
        </button>
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'co-admin') && (
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: window.innerWidth <= 480 ? '10px' : '10px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              width: window.innerWidth <= 480 ? '100%' : 'auto'
            }}
            onClick={onShowUserManagement}
          >
            {window.innerWidth <= 480 ? '👥' : '👥 Users'}
          </button>
        )}
        {currentUser && (
          <button
            style={{
              background: '#dc2626',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: window.innerWidth <= 480 ? '10px' : '10px 30px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              width: window.innerWidth <= 480 ? '100%' : 'auto'
            }}
            onClick={onLogout}
          >
            {window.innerWidth <= 480 ? '🚪' : '🚪 Logout'}
          </button>
        )}
      </div>
    </header>
  );
}
