"use client";

import React, { useState } from "react";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [loginData, setLoginData] = useState({
    name: '',
    pin: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        onLogin(result.user);
        onClose();
        setLoginData({ name: '', pin: '', role: 'admin' });
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        width: '400px',
        maxWidth: '90vw'
      }}>
        <h2 style={{ color: '#1e5799', marginBottom: '20px', textAlign: 'center' }}>
          🔐 Dashboard Login
        </h2>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Role:
            </label>
            <select
              value={loginData.role}
              onChange={(e) => setLoginData({...loginData, role: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="admin">Admin</option>
              <option value="co-admin">Co-Admin</option>
              <option value="tester">Tester</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Name:
            </label>
            <input
              type="text"
              value={loginData.name}
              onChange={(e) => setLoginData({...loginData, name: e.target.value})}
              placeholder="Enter your name"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          {(loginData.role === 'admin' || loginData.role === 'co-admin') && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                PIN:
              </label>
              <input
                type="password"
                value={loginData.pin}
                onChange={(e) => setLoginData({...loginData, pin: e.target.value})}
                placeholder="Enter PIN"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: '#1e5799',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Logging in...' : '🚀 Login'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 20px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}