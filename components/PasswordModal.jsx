"use client";

import React, { useState, useEffect, useRef } from "react";

export default function PasswordModal({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onConfirm();
        onClose();
        setPassword("");
      } else {
        setError(true);
        setPassword("");
      }
    } catch (err) {
      console.error("Password verification error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="password-modal">
      <div className="password-dialog">
        <h3>🔒 Enter Password to Start Editing</h3>
        <input
          ref={inputRef}
          type="password"
          className="password-input"
          placeholder={
            error ? "Incorrect password! Try again" : "Enter password"
          }
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(false);
          }}
          onKeyDown={handleKeyDown}
          style={
            error ? { borderColor: "#dc2626", backgroundColor: "#feeceb" } : {}
          }
          maxLength={20}
          autoComplete="off"
          disabled={loading}
        />
        <div className="password-buttons">
          <button
            className="password-btn confirm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Verifying..." : "✓ Confirm"}
          </button>
          <button
            className="password-btn cancel"
            onClick={() => {
              onClose();
              setPassword("");
              setError(false);
            }}
            disabled={loading}
          >
            ✗ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}