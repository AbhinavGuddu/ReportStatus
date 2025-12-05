"use client";

import React, { useState, useEffect } from "react";

export default function UserManagement({ currentUser, onClose }) {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'tester',
    pin: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('Current users:', users);
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users?includeInactive=true');
      const result = await response.json();
      console.log('API Response:', result);
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error('API Error:', result.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRemoveUser = async (userId, userName) => {
    if (!confirm(`Remove ${userName} from dashboard?`)) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: currentUser._id })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsers(users.filter(u => u._id !== userId));
        alert('✅ User removed successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error removing user: ' + error.message);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          addedBy: currentUser._id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setUsers([result.data, ...users]);
        setNewUser({ name: '', email: '', role: 'tester', pin: '' });
        setShowAddUser(false);
        alert('✅ User added successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error adding user: ' + error.message);
    }
  };

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
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#1e5799', margin: 0 }}>👥 User Management</h2>
          <button
            onClick={onClose}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <button
          onClick={() => setShowAddUser(!showAddUser)}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            marginBottom: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Add New User
        </button>

        {showAddUser && (
          <div style={{
            background: '#f0f8ff',
            border: '2px solid #1e5799',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#1e5799', marginBottom: '15px' }}>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role:</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="tester">Tester</option>
                    <option value="co-admin">Co-Admin</option>
                  </select>
                </div>
                {(newUser.role === 'co-admin') && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>PIN:</label>
                    <input
                      type="password"
                      value={newUser.pin}
                      onChange={(e) => setNewUser({...newUser, pin: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✅ Add User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h3 style={{ color: '#1e5799', marginBottom: '15px' }}>Current Users ({users.length})</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {users.map((user) => (
              <div
                key={user._id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e5799', fontSize: '16px' }}>
                    {user.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    📧 {user.email}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '5px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      background: user.role === 'admin' ? '#dc2626' : user.role === 'co-admin' ? '#f59e0b' : '#10b981',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                    {!user.isActive && (
                      <span style={{
                        background: '#6b7280',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px'
                      }}>
                        INACTIVE
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                    {user.lastLogin ? `Last: ${new Date(user.lastLogin).toLocaleDateString()}` : 'Never logged in'}
                  </div>
                  {currentUser.role === 'admin' && user._id !== currentUser._id && (
                    <button
                      onClick={() => handleRemoveUser(user._id, user.name)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}