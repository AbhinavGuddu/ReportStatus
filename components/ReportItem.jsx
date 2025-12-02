"use client";

import React from "react";

export default function ReportItem({ report, isEditMode, onStatusChange, onReportDelete, onReportEdit }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status completed";
      case "in-progress":
        return "status pending";
      case "not-started":
        return "status not-started";
      default:
        return "status not-started";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "✓ Completed";
      case "in-progress":
        return "In Progress";
      case "not-started":
        return "✗ Not Started";
      default:
        return "✗ Not Started";
    }
  };

  const handleClick = () => {
    if (!isEditMode) return;

    // Cycle through statuses
    let newStatus;
    if (report.status === "completed") newStatus = "in-progress";
    else if (report.status === "in-progress") newStatus = "not-started";
    else newStatus = "completed";

    onStatusChange(report._id, newStatus);
  };

  return (
    <div
      className="list-item"
      onClick={handleClick}
      style={{ 
        cursor: isEditMode ? "pointer" : "default",
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
      
      {isEditMode && (
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
