"use client";

import React from "react";
import ReportItem from "./ReportItem";

export default function CategorySection({
  category,
  reports,
  isEditMode,
  onStatusChange,
  onCategoryUpdate,
  onCategoryDelete,
  onReportAdd,
  onReportDelete,
  onReportEdit,
  onCategoryEdit,
}) {
  // Calculate category stats
  const completed = reports.filter((r) => r.status === "completed").length;
  const inProgress = reports.filter((r) => r.status === "in-progress").length;
  const notStarted = reports.filter((r) => r.status === "not-started").length;

  const [editingCategory, setEditingCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState(category.name);
  const [showAddReport, setShowAddReport] = React.useState(false);
  const [newReportName, setNewReportName] = React.useState('');

  const handleCategoryEdit = () => {
    if (editingCategory) {
      onCategoryUpdate(category._id, newCategoryName);
      setEditingCategory(false);
    } else {
      onCategoryEdit && onCategoryEdit(category._id, category.name);
    }
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    if (newReportName.trim()) {
      onReportAdd(category._id, newReportName);
      setNewReportName('');
      setShowAddReport(false);
    }
  };

  return (
    <div className="section" id={`category-${category._id}`}>
      <h2 className="section-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {editingCategory ? (
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCategoryEdit();
                if (e.key === 'Escape') {
                  setEditingCategory(false);
                  setNewCategoryName(category.name);
                }
              }}
              style={{
                fontSize: '22px',
                color: '#1e5799',
                border: '2px solid #1e5799',
                borderRadius: '6px',
                padding: '5px 10px',
                background: 'white'
              }}
              autoFocus
            />
          ) : (
            category.name
          )}
          
          {isEditMode && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCategoryEdit}
                style={{
                  background: editingCategory ? '#10b981' : '#1e5799',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {editingCategory ? '✓ Save' : '✏️ Edit'}
              </button>
              <button
                onClick={() => setShowAddReport(!showAddReport)}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                ➕ Add Report
              </button>
              <button
                onClick={() => {
                  onCategoryDelete && onCategoryDelete(category._id, category.name);
                }}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
        
        <span className="category-status">
          {completed > 0 && (
            <span className="status completed">✓ {completed} Completed</span>
          )}
          {completed > 0 && (inProgress > 0 || notStarted > 0) && " / "}
          {inProgress > 0 && (
            <span className="status pending">{inProgress} In Progress</span>
          )}
          {(completed > 0 || inProgress > 0) && notStarted > 0 && " / "}
          {notStarted > 0 && (
            <span className="status not-started">{notStarted} Not Started</span>
          )}
        </span>
      </h2>
      
      {/* Add Report Form */}
      {isEditMode && showAddReport && (
        <div style={{
          background: '#f0f8ff',
          border: '2px solid #1e5799',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <form onSubmit={handleAddReport} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={newReportName}
              onChange={(e) => setNewReportName(e.target.value)}
              placeholder="Enter report name..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              required
            />
            <button
              type="submit"
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ➕ Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddReport(false)}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <div className="list-container">
        {reports.map((report) => (
          <ReportItem
            key={report._id}
            report={report}
            isEditMode={isEditMode}
            onStatusChange={onStatusChange}
            onReportDelete={onReportDelete}
            onReportEdit={onReportEdit}
          />
        ))}
      </div>
    </div>
  );
}
