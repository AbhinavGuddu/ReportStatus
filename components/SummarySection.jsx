"use client";

import React from "react";

export default function SummarySection({
  stats,
  isEditMode,
  timeRemaining,
  onUpdateData,
  sectionName,
  isTestingMode,
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: window.innerWidth <= 480 ? '15px' : window.innerWidth <= 768 ? '20px' : '25px',
      borderRadius: '10px',
      marginBottom: window.innerWidth <= 480 ? '20px' : '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: window.innerWidth <= 480 ? '15px' : '20px' }}>
        <h2 style={{
          fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '20px' : '24px',
          marginBottom: '10px',
          color: 'white'
        }}>{sectionName} Progress Summary</h2>
        {isTestingMode && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: window.innerWidth <= 480 ? '12px' : '14px',
            fontWeight: 'bold'
          }}>
            ⏰ Next Testing Cycle: {timeRemaining || 'Calculating...'}
          </div>
        )}
      </div>
      {/* Reports Completion Progress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 480 ? 'repeat(2, 1fr)' : 
                           window.innerWidth <= 768 ? 'repeat(3, 1fr)' : 
                           'repeat(4, 1fr)',
        gap: window.innerWidth <= 480 ? '8px' : window.innerWidth <= 768 ? '12px' : '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: window.innerWidth <= 480 ? '10px 8px' : '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #10b981',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '24px' : '28px',
            fontWeight: 'bold',
            marginBottom: '3px'
          }}>{stats.completed}</div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '9px' : '12px',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Completed</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: window.innerWidth <= 480 ? '10px 8px' : '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #f59e0b',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '24px' : '28px',
            fontWeight: 'bold',
            marginBottom: '3px'
          }}>{stats.inProgress}</div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '9px' : '12px',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>In Progress</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: window.innerWidth <= 480 ? '10px 8px' : '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #ef4444',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '24px' : '28px',
            fontWeight: 'bold',
            marginBottom: '3px'
          }}>{stats.notStarted}</div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '9px' : '12px',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Not Started</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: window.innerWidth <= 480 ? '10px 8px' : '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #3b82f6',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '24px' : '28px',
            fontWeight: 'bold',
            marginBottom: '3px'
          }}>{stats.total}</div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '9px' : '12px',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Total Reports</div>
        </div>
      </div>
      
      {/* Testing Progress Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 480 ? 'repeat(2, 1fr)' : 
                           window.innerWidth <= 768 ? 'repeat(3, 1fr)' : 
                           'repeat(3, 1fr)',
        gap: window.innerWidth <= 480 ? '8px' : window.innerWidth <= 768 ? '12px' : '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: window.innerWidth <= 480 ? '10px 8px' : '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #d97706',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '24px' : '28px',
            fontWeight: 'bold',
            marginBottom: '3px'
          }}>{stats.testing}</div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '9px' : '12px',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Testing</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: window.innerWidth <= 480 ? '10px 8px' : '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #059669',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '24px' : '28px',
            fontWeight: 'bold',
            marginBottom: '3px'
          }}>{stats.verified}</div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '9px' : '12px',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Verified</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: window.innerWidth <= 480 ? '10px 8px' : '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #be185d',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '24px' : '28px',
            fontWeight: 'bold',
            marginBottom: '3px'
          }}>{stats.failedTesting}</div>
          <div style={{
            fontSize: window.innerWidth <= 480 ? '9px' : '12px',
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Failed Testing</div>
        </div>
      </div>
    </div>
  );
}
