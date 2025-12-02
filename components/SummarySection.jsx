"use client";

import React from "react";

export default function SummarySection({
  stats,
  isEditMode,
  onUpdateData,
  sectionName,
}) {
  return (
    <div className="summary-section">
      <h2 className="summary-title">{sectionName} Progress Summary</h2>
      <div className="summary-cards">
        <div className="summary-card completed-card">
          <div className="summary-number">{stats.completed}</div>
          <div className="summary-label">Completed</div>
        </div>
        <div className="summary-card progress-card">
          <div className="summary-number">{stats.inProgress}</div>
          <div className="summary-label">In Progress</div>
        </div>
        <div className="summary-card not-started-card">
          <div className="summary-number">{stats.notStarted}</div>
          <div className="summary-label">Not Started</div>
        </div>
        <div className="summary-card total-card">
          <div className="summary-number">{stats.total}</div>
          <div className="summary-label">Total Reports</div>
        </div>
      </div>

    </div>
  );
}
