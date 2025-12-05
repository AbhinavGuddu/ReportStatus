/* eslint-disable curly */
"use client";

import React from "react";

export default function ReportItem({ report, isEditMode, currentUser, onStatusChange, onReportDelete, onReportEdit }) {
  
  // Check user permissions
  const hasAdminPermissions = currentUser && (currentUser.role === 'admin' || currentUser.role === 'co-admin');
  const isTester = currentUser && currentUser.role === 'tester';
  const canEditStatus = currentUser && (hasAdminPermissions || isTester); // Remove isEditMode dependency for testers
  const canEditReport = isEditMode && hasAdminPermissions;
  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status completed";
      case "in-progress":
        return "status pending";
      case "not-started":
        return "status not-started";
      case "testing":
        return "status testing";
      case "verified":
        return "status verified";
      case "failed-testing":
        return "status failed-testing";
      default:
        return "status not-started";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "✓ Completed";
      case "in-progress":
        return "⏳ In Progress";
      case "not-started":
        return "✗ Not Started";
      case "testing":
        return "🧪 Testing";
      case "verified":
        return "✅ Verified";
      case "failed-testing":
        return "❌ Failed Testing";
      default:
        return "✗ Not Started";
    }
  };

  const handleClick = () => {
    if (!canEditStatus) return;

    // Different status cycles for different roles
    let newStatus;
    
    if (isTester) {
      // Testers can cycle through: testing → verified → failed-testing → testing
      switch (report.status) {
        case "not-started":
          newStatus = "in-progress";
          break;
        case "in-progress":
          newStatus = "completed";
          break;
        case "completed":
          newStatus = "testing";
          break;
        case "testing":
          newStatus = "verified";
          break;
        case "verified":
          newStatus = "failed-testing";
          break;
        case "failed-testing":
          newStatus = "not-started";
          break;
        default:
          newStatus = "not-started";
      }
    } else {
      // Admin/Co-admin: Full cycle
      switch (report.status) {
        case "not-started":
          newStatus = "in-progress";
          break;
        case "in-progress":
          newStatus = "completed";
          break;
        case "completed":
          newStatus = "testing";
          break;
        case "testing":
          newStatus = "verified";
          break;
        case "verified":
          newStatus = "failed-testing";
          break;
        case "failed-testing":
          newStatus = "not-started";
          break;
        default:
          newStatus = "not-started";
      }
    }

    onStatusChange(report._id, newStatus);
  };

  return (
    <div
      className="list-item"
      onClick={handleClick}
      style={{ 
        cursor: canEditStatus ? "pointer" : "default",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        <span>{report.name}</span>
        <span className={getStatusClass(report.status)}>
          {getStatusText(report.status)}
        </span>
      </div>
      
      {canEditReport && (
        <div style={{ display: 'flex', gap: '5px' }}>
          {onReportEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReportEdit(report._id, report.name);
              }}
              style={{
                background: '#1e5799',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ✏️
            </button>
          )}
          {onReportDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReportDelete(report._id, report.name);
              }}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
