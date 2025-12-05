"use client";

import React from "react";
import ReportItem from "./ReportItem";

export default function CategorySection({
  category,
  reports,
  isEditMode,
  isTestingMode,
  currentUser,
  onStatusChange,
  onCategoryUpdate,
  onCategoryDelete,
  onReportAdd,
  onReportDelete,
  onReportEdit,
  onCategoryEdit,
  onMarkAllVerified,
}) {
  
  // Check if user has admin permissions
  const hasAdminPermissions = currentUser && (currentUser.role === 'admin' || currentUser.role === 'co-admin');
  const isTester = currentUser && currentUser.role === 'tester';
  // Calculate category stats
  const completed = reports.filter((r) => r.status === "completed").length;
  const inProgress = reports.filter((r) => r.status === "in-progress").length;
  const notStarted = reports.filter((r) => r.status === "not-started").length;
  const testing = reports.filter((r) => r.status === "testing").length;
  const verified = reports.filter((r) => r.status === "verified").length;
  const failedTesting = reports.filter((r) => r.status === "failed-testing").length;

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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: window.innerWidth <= 480 ? '15px' : window.innerWidth <= 768 ? '20px' : '25px',
      marginBottom: window.innerWidth <= 480 ? '20px' : '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    }} id={`category-${category._id}`}>
      <h2 style={{
        fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '20px' : '22px',
        color: '#1e5799',
        marginBottom: window.innerWidth <= 480 ? '15px' : '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #eaeaea',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            flex: '1'
          }}>
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
          
          {isEditMode && hasAdminPermissions && (
            <div style={{ 
              display: 'flex', 
              gap: '4px',
              flexWrap: 'nowrap'
            }}>
              <button
                onClick={handleCategoryEdit}
                title={editingCategory ? 'Save Category Name' : 'Edit Category Name'}
                style={{
                  background: editingCategory ? '#10b981' : '#1e5799',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  minWidth: '32px'
                }}
              >
                {editingCategory ? '✓' : '✏️'}
              </button>
              <button
                onClick={() => setShowAddReport(!showAddReport)}
                title="Add New Report"
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  minWidth: '32px'
                }}
              >
                ➕
              </button>
              <button
                onClick={() => {
                  onCategoryDelete && onCategoryDelete(category._id, category.name);
                }}
                title="Delete Category"
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  minWidth: '32px'
                }}
              >
                🗑️
              </button>
              {(isTestingMode || hasAdminPermissions) && (
                <button
                  onClick={() => onMarkAllVerified && onMarkAllVerified(category._id)}
                  title="Mark All Reports as Verified"
                  style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    minWidth: '32px'
                  }}
                >
                  ✅
                </button>
              )}
            </div>
          )}
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: '1'
          }}>
          {completed > 0 && (
            <span style={{
              display: 'inline-block',
              padding: window.innerWidth <= 480 ? '4px 8px' : '5px 12px',
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '11px' : '14px',
              fontWeight: '500',
              backgroundColor: '#e6f7ee',
              color: '#0d8b5e'
            }}>✓ {completed} Completed</span>
          )}
          {inProgress > 0 && (
            <span style={{
              display: 'inline-block',
              padding: window.innerWidth <= 480 ? '4px 8px' : '5px 12px',
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '11px' : '14px',
              fontWeight: '500',
              backgroundColor: '#fff8e6',
              color: '#d97706'
            }}>{inProgress} In Progress</span>
          )}
          {notStarted > 0 && (
            <span style={{
              display: 'inline-block',
              padding: window.innerWidth <= 480 ? '4px 8px' : '5px 12px',
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '11px' : '14px',
              fontWeight: '500',
              backgroundColor: '#feeceb',
              color: '#dc2626'
            }}>{notStarted} Not Started</span>
          )}
          {testing > 0 && (
            <span style={{
              display: 'inline-block',
              padding: window.innerWidth <= 480 ? '4px 8px' : '5px 12px',
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '11px' : '14px',
              fontWeight: '500',
              backgroundColor: '#fef3c7',
              color: '#d97706'
            }}>🧪 {testing} Testing</span>
          )}
          {verified > 0 && (
            <span style={{
              display: 'inline-block',
              padding: window.innerWidth <= 480 ? '4px 8px' : '5px 12px',
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '11px' : '14px',
              fontWeight: '500',
              backgroundColor: '#d1fae5',
              color: '#059669'
            }}>✅ {verified} Verified</span>
          )}
          {failedTesting > 0 && (
            <span style={{
              display: 'inline-block',
              padding: window.innerWidth <= 480 ? '4px 8px' : '5px 12px',
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '11px' : '14px',
              fontWeight: '500',
              backgroundColor: '#fce7f3',
              color: '#be185d'
            }}>❌ {failedTesting} Failed</span>
          )}
          </div>
        </div>
      </h2>
      
      {/* Add Report Form */}
      {isEditMode && hasAdminPermissions && showAddReport && (
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : 
                           window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 
                           'repeat(auto-fill, minmax(300px, 1fr))',
        gap: window.innerWidth <= 480 ? '10px' : '15px'
      }}>
        {reports.map((report) => (
          <ReportItem
            key={report._id}
            report={report}
            isEditMode={isEditMode}
            currentUser={currentUser}
            onStatusChange={onStatusChange}
            onReportDelete={onReportDelete}
            onReportEdit={onReportEdit}
          />
        ))}
      </div>
    </div>
  );
}
