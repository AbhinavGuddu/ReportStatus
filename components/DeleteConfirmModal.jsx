"use client";

import React, { useState, useEffect, useRef } from "react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, itemType }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onConfirm();
        onClose();
      } else {
        setError(true);
        setPassword("");
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        width: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ color: '#dc2626', marginBottom: '15px' }}>🗑️ Confirm Delete</h3>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Are you sure you want to delete {itemType} <strong>"{itemName}"</strong>?
        </p>
        <p style={{ marginBottom: '15px', fontSize: '14px', color: '#999' }}>
          Enter password to confirm:
        </p>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') onClose();
          }}
          placeholder={error ? "Wrong password! Try again" : "Enter password"}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: error ? '2px solid #dc2626' : '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px',
            marginBottom: '20px',
            backgroundColor: error ? '#feeceb' : 'white'
          }}
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}