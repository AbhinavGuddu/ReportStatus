'use client';

import React, { useState, useEffect } from 'react';

export default function ManualAdd({ environment, categories, onDataUpdate }) {
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('category');
  const [categoryName, setCategoryName] = useState('');
  const [reportName, setReportName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Listen for the custom event from sidebar
  useEffect(() => {
    const handleOpenManualAdd = () => {
      setShowManualAdd(true);
    };

    window.addEventListener('openManualAdd', handleOpenManualAdd);
    return () => window.removeEventListener('openManualAdd', handleOpenManualAdd);
  }, []);

  async function handleAddCategory(event) {
    event.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName,
          environment,
          order: categories.length + 1
        })
      });

      if (response.ok) {
        setMessage({ text: 'Category added successfully!', type: 'success' });
        setCategoryName('');
        onDataUpdate();
      } else {
        setMessage({ text: 'Failed to add category', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error adding category', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReport(event) {
    event.preventDefault();
    if (!reportName.trim() || !selectedCategory) return;

    setLoading(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reportName,
          category: selectedCategory,
          environment,
          status: 'not-started',
          order: 99
        })
      });

      if (response.ok) {
        setMessage({ text: 'Report added successfully!', type: 'success' });
        setReportName('');
        onDataUpdate();
      } else {
        setMessage({ text: 'Failed to add report', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error adding report', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (!showManualAdd) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
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
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{ color: '#1e5799', margin: 0 }}>📝 Add New Items</h2>
          <button
            onClick={() => setShowManualAdd(false)}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <button
            onClick={() => setActiveTab('category')}
            style={{ 
              flex: 1,
              background: activeTab === 'category' ? '#1e5799' : '#f0f0f0',
              color: activeTab === 'category' ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📁 Add Category
          </button>
          <button
            onClick={() => setActiveTab('report')}
            style={{ 
              flex: 1,
              background: activeTab === 'report' ? '#1e5799' : '#f0f0f0',
              color: activeTab === 'report' ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📊 Add Report
          </button>
        </div>

        {message.text && (
          <div style={{
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            backgroundColor: message.type === 'success' ? '#e6f7ee' : '#feeceb',
            color: message.type === 'success' ? '#0d8b5e' : '#dc2626',
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        {activeTab === 'category' ? (
          <form onSubmit={handleAddCategory}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1e5799' }}>
                Category Name
              </label>
              <input
                type='text'
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder='e.g., New Module'
                required
              />
            </div>
            <button
              type='submit'
              style={{ 
                width: '100%',
                background: '#1e5799',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              {loading ? '⏳ Adding...' : '✅ Add Category'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddReport}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1e5799' }}>
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
                required
              >
                <option value=''>-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1e5799' }}>
                Report Name
              </label>
              <input
                type='text'
                value={reportName}
                onChange={(event) => setReportName(event.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder='e.g., Monthly Summary'
                required
              />
            </div>
            <button
              type='submit'
              style={{ 
                width: '100%',
                background: '#1e5799',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              {loading ? '⏳ Adding...' : '📊 Add Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}