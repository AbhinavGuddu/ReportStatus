"use client";

import React, { useState, useEffect } from "react";

export default function QuickActions({ categories, stats, isEditMode, onQuickAction }) {
  const [isOpen, setIsOpen] = useState(true);

  const getRecentActivity = () => {
    const activities = [];
    categories.forEach(cat => {
      if (cat.reports) {
        cat.reports.forEach(report => {
          // Add activity based on updatedAt or status
          const activity = {
            name: report.name,
            category: cat.name,
            status: report.status,
            time: report.updatedAt || report.createdAt || new Date(),
            id: report._id
          };
          activities.push(activity);
        });
      }
    });
    
    // Sort by time (most recent first) and take last 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time

    return () => clearInterval(timer);
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = currentTime;
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 10) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return { icon: '✅', color: '#10b981', text: 'Completed' };
      case 'in-progress': return { icon: '⏳', color: '#f59e0b', text: 'In Progress' };
      case 'not-started': return { icon: '⭕', color: '#ef4444', text: 'Not Started' };
      default: return { icon: '❓', color: '#6b7280', text: 'Unknown' };
    }
  };

  const getProgressPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const quickShortcuts = [
    { icon: "➕", label: "Quick Add", action: "quick_add", color: "#10b981" },
    { icon: "🔄", label: "Refresh", action: "refresh", color: "#1e5799" },
    { icon: "📊", label: "Mark All Done", action: "mark_all_done", color: "#10b981" },
    { icon: "📝", label: "Export List", action: "export_list", color: "#f59e0b" }
  ];

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1e5799',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          ⚡
        </button>
      )}

      {/* Right Sidebar */}
      <div
        style={{
          position: 'fixed',
          right: isOpen ? '0' : '-280px',
          top: '0',
          width: '280px',
          height: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '20px',
          zIndex: 1000,
          transition: 'right 0.3s ease',
          overflowY: 'auto',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          borderLeft: '1px solid #e2e8f0'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #1e5799',
          paddingBottom: '10px'
        }}>
          <h3 style={{ color: '#1e5799', margin: 0, fontSize: '18px' }}>
            ⚡ Quick Actions
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress Circle */}
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <h4 style={{ color: '#1e5799', marginBottom: '15px', fontSize: '14px' }}>
            🎯 Overall Progress
          </h4>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `conic-gradient(#10b981 ${getProgressPercentage() * 3.6}deg, #e5e7eb 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e5799'
            }}>
              {getProgressPercentage()}%
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            {stats.completed} of {stats.total} completed
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ color: '#1e5799', marginBottom: '15px', fontSize: '14px' }}>
            🕒 Recent Activity
          </h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {getRecentActivity().length > 0 ? getRecentActivity().map((activity, index) => {
              const statusInfo = getStatusIcon(activity.status);
              return (
                <div
                  key={activity.id}
                  style={{
                    background: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    marginBottom: '6px',
                    border: `1px solid ${statusInfo.color}20`,
                    borderLeft: `3px solid ${statusInfo.color}`,
                    fontSize: '12px'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '2px'
                  }}>
                    <span style={{ color: statusInfo.color, fontWeight: 'bold', fontSize: '10px' }}>
                      {statusInfo.icon} {statusInfo.text}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '9px' }}>
                      {getTimeAgo(activity.time)}
                    </span>
                  </div>
                  <div style={{ color: '#374151', fontWeight: '500' }}>{activity.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '10px' }}>in {activity.category}</div>
                </div>
              );
            }) : (
              <div style={{
                background: '#f9fafb',
                padding: '15px',
                borderRadius: '6px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '12px'
              }}>
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ color: '#1e5799', marginBottom: '15px', fontSize: '14px' }}>
            📁 Categories ({categories.length})
          </h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {categories.map((cat, index) => (
              <div
                key={cat._id}
                style={{
                  background: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#1e5799' }}>
                  {index + 1}. {cat.name}
                </div>
                <div style={{ color: '#666', fontSize: '11px' }}>
                  {cat.reports?.length || 0} reports
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts */}
        {isEditMode && (
          <div>
            <h4 style={{ color: '#1e5799', marginBottom: '15px', fontSize: '14px' }}>
              ⚡ Quick Shortcuts
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {quickShortcuts.map((shortcut, index) => (
                <button
                  key={index}
                  onClick={() => onQuickAction && onQuickAction(shortcut.action)}
                  style={{
                    background: 'white',
                    border: `2px solid ${shortcut.color}`,
                    borderRadius: '8px',
                    padding: '10px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: shortcut.color,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = shortcut.color;
                    e.target.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = shortcut.color;
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{shortcut.icon}</span>
                  <span>{shortcut.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '15px'
        }}>
          💡 Right sidebar for quick access
        </div>
      </div>
    </>
  );
}