"use client";

import React, { useState, useEffect, useRef } from "react";

export default function EditModal({ isOpen, onClose, onConfirm, title, currentValue, placeholder }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setValue(currentValue || "");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (value.trim() && value.trim() !== currentValue) {
      onConfirm(value.trim());
      onClose();
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
        <h3 style={{ color: '#1e5799', marginBottom: '20px' }}>{title}</h3>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') onClose();
          }}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px',
            marginBottom: '20px'
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
              background: '#1e5799',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}