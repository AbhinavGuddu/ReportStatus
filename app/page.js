'use client';

import { useEffect, useState } from 'react';
import AbhiBuddy from '@/components/AbhiBuddy';
import ManualAdd from '@/components/ManualAdd';
import CategorySection from '@/components/CategorySection';
import CategorySidebar from '@/components/CategorySidebar';
import DashboardHeader from '@/components/DashboardHeader';
import PasswordModal from '@/components/PasswordModal';
import SummarySection from '@/components/SummarySection';
import EditModal from '@/components/EditModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import QuickActions from '@/components/QuickActions';

export default function Home() {
  const [currentSection, setCurrentSection] = useState('aws');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editModal, setEditModal] = useState({ isOpen: false, type: '', id: '', currentValue: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: '', name: '' });

  // Client info based on section
  const clientInfo =
    currentSection === 'aws'
      ? { client: 'PI25ANG3', env: 'AWS/NextGen' }
      : { client: 'NMBIRT01', env: 'DC/Autopay' };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/reports?environment=${currentSection}`,
        );
        const result = await response.json();
        if (result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentSection, refreshTrigger]);

  // Calculate summary stats
  const calculateStats = () => {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    categories.forEach((category) => {
      category.reports.forEach((report) => {
        if (report.status === 'completed') completed++;
        else if (report.status === 'in-progress') inProgress++;
        else notStarted++;
      });
    });

    return {
      completed,
      inProgress,
      notStarted,
      total: completed + inProgress + notStarted,
    };
  };

  const stats = calculateStats();

  // Handle status change
  const handleStatusChange = async (reportId, newStatus) => {
    const now = new Date().toISOString();
    
    // Optimistic update with current timestamp
    setCategories((prevCategories) => {
      return prevCategories.map((category) => ({
        ...category,
        reports: category.reports.map((report) =>
          report._id === reportId ? { 
            ...report, 
            status: newStatus,
            updatedAt: now
          } : report,
        ),
      }));
    });

    // API call
    try {
      await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          updatedAt: now
        }),
      });
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert on error (could be improved)
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <>
      <CategorySidebar 
        categories={categories}
        isEditMode={isEditMode}
        onCategoryClick={(categoryId) => {
          // Optional: Add any additional logic when category is clicked
        }}
        onAddCategory={async (name) => {
          try {
            const response = await fetch('/api/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name,
                environment: currentSection,
                order: categories.length + 1
              })
            });
            if (response.ok) {
              setRefreshTrigger((prev) => prev + 1);
            }
          } catch (error) {
            console.error('Error adding category:', error);
          }
        }}
      />
      <div className="container">
      <DashboardHeader
        currentSection={currentSection}
        onSwitchSection={setCurrentSection}
        clientInfo={clientInfo}
        isEditMode={isEditMode}
        onStartEditing={() => setShowPasswordModal(true)}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
          Loading...
        </div>
      ) : (
        <>
          <SummarySection
            stats={stats}
            isEditMode={isEditMode}
            onUpdateData={() => {
              alert(
                '✨ Data is automatically saved to the database!\n\nNo need to manually update.',
              );
            }}
            sectionName={clientInfo.env}
          />



          {categories.map((category) => (
            <CategorySection
              key={category._id}
              category={category}
              reports={category.reports}
              isEditMode={isEditMode}
              onStatusChange={handleStatusChange}
              onCategoryUpdate={async (categoryId, newName) => {
                try {
                  const response = await fetch(`/api/categories/${categoryId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                  });
                  if (response.ok) {
                    setRefreshTrigger((prev) => prev + 1);
                  }
                } catch (error) {
                  console.error('Error updating category:', error);
                }
              }}
              onCategoryDelete={async (categoryId) => {
                try {
                  const response = await fetch(`/api/categories/${categoryId}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    setRefreshTrigger((prev) => prev + 1);
                  }
                } catch (error) {
                  console.error('Error deleting category:', error);
                }
              }}
              onReportAdd={async (categoryId, reportName) => {
                try {
                  const response = await fetch('/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: reportName,
                      category: categoryId,
                      environment: currentSection,
                      status: 'not-started',
                      order: 99
                    })
                  });
                  if (response.ok) {
                    setRefreshTrigger((prev) => prev + 1);
                  }
                } catch (error) {
                  console.error('Error adding report:', error);
                }
              }}
              onReportDelete={async (reportId) => {
                try {
                  const response = await fetch(`/api/reports/${reportId}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    setRefreshTrigger((prev) => prev + 1);
                  }
                } catch (error) {
                  console.error('Error deleting report:', error);
                }
              }}
              onReportEdit={(reportId, currentName) => {
                setEditModal({
                  isOpen: true,
                  type: 'report',
                  id: reportId,
                  currentValue: currentName
                });
              }}
              onReportDelete={(reportId, reportName) => {
                setDeleteModal({
                  isOpen: true,
                  type: 'report',
                  id: reportId,
                  name: reportName
                });
              }}
              onCategoryEdit={(categoryId, currentName) => {
                setEditModal({
                  isOpen: true,
                  type: 'category',
                  id: categoryId,
                  currentValue: currentName
                });
              }}
              onCategoryDelete={(categoryId, categoryName) => {
                setDeleteModal({
                  isOpen: true,
                  type: 'category',
                  id: categoryId,
                  name: categoryName
                });
              }}
            />
          ))}
        </>
      )}

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={() => {
          setIsEditMode(true);
          alert(
            '✨ Editing enabled! Click on any report to change its status.\n\nChanges are saved automatically to the database.',
          );
        }}
      />

      <div
        style={{
          textAlign: 'right',
          fontSize: '16px',
          marginTop: '20px',
          padding: '10px'
        }}
      >
        <span
          style={{
            color: '#4a5568',
            fontFamily: 'Arial, sans-serif',
            fontWeight: '500'
          }}
        >
          💻 Developed by{' '}
        </span>
        <span style={{ 
          fontFamily: 'Arial, sans-serif', 
          fontWeight: 'bold',
          fontSize: '18px',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'rainbow 3s ease-in-out infinite'
        }}>✨ Abhinav Guddu ✨</span>
      </div>
      
      {/* Developer Animation Styles */}
      <style jsx>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <ManualAdd
        environment={currentSection}
        categories={categories}
        onDataUpdate={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <AbhiBuddy 
        environment={currentSection}
        categories={categories}
        onDataUpdate={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <QuickActions
        categories={categories}
        stats={stats}
        isEditMode={isEditMode}
        onQuickAction={(action) => {
          if (action === 'refresh') {
            setRefreshTrigger((prev) => prev + 1);
          } else if (action === 'quick_add') {
            const event = new CustomEvent('openManualAdd');
            window.dispatchEvent(event);
          } else if (action === 'mark_all_done') {
            if (confirm('Mark all In Progress reports as Completed?')) {
              categories.forEach(cat => {
                cat.reports?.forEach(async (report) => {
                  if (report.status === 'in-progress') {
                    try {
                      await fetch(`/api/reports/${report._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'completed' })
                      });
                    } catch (error) {
                      console.error('Error updating report:', error);
                    }
                  }
                });
              });
              setTimeout(() => setRefreshTrigger((prev) => prev + 1), 1000);
            }
          } else if (action === 'export_list') {
            let exportText = `Reports Dashboard - ${new Date().toLocaleDateString()}\n\n`;
            categories.forEach(cat => {
              exportText += `${cat.name}:\n`;
              cat.reports?.forEach(report => {
                const status = report.status === 'completed' ? '✓' : 
                              report.status === 'in-progress' ? '⏳' : '⭕';
                exportText += `  ${status} ${report.name}\n`;
              });
              exportText += '\n';
            });
            
            navigator.clipboard.writeText(exportText).then(() => {
              alert('📝 Report list copied to clipboard!');
            }).catch(() => {
              alert(exportText);
            });
          }
        }}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, type: '', id: '', currentValue: '' })}
        onConfirm={async (newValue) => {
          if (editModal.type === 'category') {
            try {
              const response = await fetch(`/api/categories/${editModal.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newValue })
              });
              if (response.ok) setRefreshTrigger((prev) => prev + 1);
            } catch (error) {
              console.error('Error updating category:', error);
            }
          } else if (editModal.type === 'report') {
            try {
              const response = await fetch(`/api/reports/${editModal.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newValue })
              });
              if (response.ok) setRefreshTrigger((prev) => prev + 1);
            } catch (error) {
              console.error('Error updating report:', error);
            }
          }
        }}
        title={editModal.type === 'category' ? 'Edit Category Name' : 'Edit Report Name'}
        currentValue={editModal.currentValue}
        placeholder={editModal.type === 'category' ? 'Enter category name...' : 'Enter report name...'}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', id: '', name: '' })}
        onConfirm={async () => {
          if (deleteModal.type === 'category') {
            try {
              const response = await fetch(`/api/categories/${deleteModal.id}`, {
                method: 'DELETE'
              });
              if (response.ok) setRefreshTrigger((prev) => prev + 1);
            } catch (error) {
              console.error('Error deleting category:', error);
            }
          } else if (deleteModal.type === 'report') {
            try {
              const response = await fetch(`/api/reports/${deleteModal.id}`, {
                method: 'DELETE'
              });
              if (response.ok) setRefreshTrigger((prev) => prev + 1);
            } catch (error) {
              console.error('Error deleting report:', error);
            }
          }
        }}
        itemName={deleteModal.name}
        itemType={deleteModal.type}
      />
    </div>
    </>
  );
}
