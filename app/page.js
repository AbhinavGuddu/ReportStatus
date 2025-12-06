'use client';

import dynamic from 'next/dynamic';
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
import TestingPanel from '@/components/TestingPanel';
import LoginModal from '@/components/LoginModal';
import UserManagement from '@/components/UserManagement';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [currentSection, setCurrentSection] = useState('aws');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editModal, setEditModal] = useState({ isOpen: false, type: '', id: '', currentValue: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: '', name: '' });
  const [isTestingMode, setIsTestingMode] = useState({
    aws: false,
    dc: false
  });
  const [timeRemaining, setTimeRemaining] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Check for existing user session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setShowLoginModal(false);
          // Auto-enable edit mode for admin and co-admin
          if (user.role === 'admin' || user.role === 'co-admin') {
            setIsEditMode(true);
          }
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    // Auto-enable edit mode for admin and co-admin
    if (user.role === 'admin' || user.role === 'co-admin') {
      setIsEditMode(true);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(null);
    setShowLoginModal(true);
    setIsEditMode(false);
  };

  // 2-week biweekly testing cycle timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 5 = Friday
      const hour = now.getHours();
      
      // Calculate next 2-week cycle end (every 2nd Friday 5 PM)
      const startDate = new Date('2024-01-01'); // Reference start date
      const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      const weeksSinceStart = Math.floor(daysSinceStart / 7);
      const currentCycleWeek = weeksSinceStart % 2; // 0 = first week, 1 = second week
      
      let nextCycleEnd = new Date(now);
      
      if (currentCycleWeek === 0) {
        // First week - next cycle end is next Friday 5 PM
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
        if (daysUntilFriday === 0 && hour >= 17) {
          nextCycleEnd.setDate(nextCycleEnd.getDate() + 7); // Next Friday
        } else {
          nextCycleEnd.setDate(nextCycleEnd.getDate() + daysUntilFriday);
        }
      } else {
        // Second week - cycle ends this Friday 5 PM
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
        if (daysUntilFriday === 0 && hour >= 17) {
          // Already passed, next cycle is in 2 weeks
          nextCycleEnd.setDate(nextCycleEnd.getDate() + 14);
        } else {
          nextCycleEnd.setDate(nextCycleEnd.getDate() + daysUntilFriday);
        }
      }
      
      nextCycleEnd.setHours(17, 0, 0, 0);
      
      const timeDiff = nextCycleEnd - now;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      
      // Every 2nd week Friday at 3 PM (15:00), show warning
      if (currentCycleWeek === 1 && dayOfWeek === 5 && hour === 15) {
        if (isTestingMode.dc) {
          alert('⚠️ DC 2-week testing cycle will end in 2 hours (5 PM). All verified reports will reset to completed.');
        }
        if (isTestingMode.aws) {
          alert('⚠️ AWS 2-week testing cycle will end in 2 hours (5 PM). All verified reports will reset to completed.');
        }
      }
      
      // Every 2nd week Friday at 5 PM (17:00), end cycle and reset
      if (currentCycleWeek === 1 && dayOfWeek === 5 && hour === 17 && now.getMinutes() === 0) {
        console.log('🧪 2-week cycle completed');
        if (isTestingMode.dc) {
          resetVerifiedReports('dc');
          alert('🧪 DC 2-week testing cycle completed! Verified reports reset back to completed.');
        }
        if (isTestingMode.aws) {
          resetVerifiedReports('aws');
          alert('🧪 AWS 2-week testing cycle completed! Verified reports reset back to completed.');
        }
      }
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [isTestingMode]);

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
    let testing = 0;
    let verified = 0;
    let failedTesting = 0;

    categories.forEach((category) => {
      category.reports.forEach((report) => {
        switch (report.status) {
          case 'completed':
            completed++;
            break;
          case 'in-progress':
            inProgress++;
            break;
          case 'not-started':
            notStarted++;
            break;
          case 'testing':
            testing++;
            break;
          case 'verified':
            verified++;
            break;
          case 'failed-testing':
            failedTesting++;
            break;
          default:
            notStarted++;
        }
      });
    });

    return {
      completed,
      inProgress,
      notStarted,
      testing,
      verified,
      failedTesting,
      total: completed + inProgress + notStarted + testing + verified + failedTesting,
    };
  };

  const stats = calculateStats();

  // Reset verified reports back to completed for new cycle (environment-specific)
  const resetVerifiedReports = async (environment) => {
    const now = new Date().toISOString();
    
    try {
      // Fetch fresh data from database to get all verified reports
      const response = await fetch(`/api/reports?environment=${environment}`);
      const result = await response.json();
      
      if (result.data) {
        const allVerifiedReports = [];
        
        // Collect all verified reports from fresh data
        result.data.forEach(category => {
          category.reports.forEach(report => {
            if (report.status === 'verified') {
              allVerifiedReports.push(report);
            }
          });
        });
        
        console.log(`Found ${allVerifiedReports.length} verified reports in ${environment} to reset`);
        
        // Update all verified reports to completed
        const updatePromises = allVerifiedReports.map(report => 
          fetch(`/api/reports/${report._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              status: 'completed',
              updatedAt: now,
              updatedBy: 'System (Cycle Reset)'
            }),
          }).then(() => {
            console.log(`✅ Reset ${report.name} from verified to completed`);
          }).catch(error => {
            console.error(`❌ Error resetting ${report.name}:`, error);
          })
        );
        
        // Wait for all updates to complete
        await Promise.all(updatePromises);
        
        // Refresh the UI
        setRefreshTrigger((prev) => prev + 1);
        
        console.log(`🔄 Reset completed for ${allVerifiedReports.length} reports in ${environment}`);
      }
    } catch (error) {
      console.error('Error in resetVerifiedReports:', error);
    }
  };

  // Move completed reports to testing
  const moveCompletedToTesting = async () => {
    const now = new Date().toISOString();
    
    categories.forEach(category => {
      category.reports.forEach(async (report) => {
        if (report.status === 'completed') {
          try {
            await fetch(`/api/reports/${report._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                status: 'testing',
                updatedAt: now
              }),
            });
          } catch (error) {
            console.error('Error moving report to testing:', error);
          }
        }
      });
    });
    
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle status change
  const handleStatusChange = async (reportId, newStatus) => {
    const now = new Date().toISOString();
    
    // Optimistic update with current timestamp and user info
    setCategories((prevCategories) => {
      return prevCategories.map((category) => ({
        ...category,
        reports: category.reports.map((report) =>
          report._id === reportId ? { 
            ...report, 
            status: newStatus,
            updatedAt: now,
            updatedBy: currentUser?.name || 'Unknown'
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
          updatedAt: now,
          updatedBy: currentUser?.name || 'Unknown'
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
        isTestingMode={isTestingMode[currentSection]}
        currentUser={currentUser}
        onStartEditing={() => setShowPasswordModal(true)}
        onToggleTesting={() => setIsTestingMode(prev => ({
          ...prev,
          [currentSection]: !prev[currentSection]
        }))}
        onLogout={handleLogout}
        onShowUserManagement={() => setShowUserManagement(true)}
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
            timeRemaining={timeRemaining}
            isTestingMode={isTestingMode[currentSection]}
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
              isTestingMode={isTestingMode[currentSection]}
              currentUser={currentUser}
              onStatusChange={handleStatusChange}
              onMarkAllVerified={async (categoryId) => {
                const now = new Date().toISOString();
                const categoryReports = categories.find(cat => cat._id === categoryId)?.reports || [];
                
                for (const report of categoryReports) {
                  try {
                    await fetch(`/api/reports/${report._id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        status: 'verified',
                        updatedAt: now
                      }),
                    });
                  } catch (error) {
                    console.error('Error marking report as verified:', error);
                  }
                }
                
                setRefreshTrigger((prev) => prev + 1);
              }}
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
              onCategoryEdit={(categoryId, currentName) => {
                setEditModal({
                  isOpen: true,
                  type: 'category',
                  id: categoryId,
                  currentValue: currentName
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
        currentSection={currentSection}
        onQuickAction={(action) => {
          if (action === 'refresh') {
            setRefreshTrigger((prev) => prev + 1);
          } else if (action === 'quick_add') {
            if (typeof window !== 'undefined') {
              const event = new CustomEvent('openManualAdd');
              window.dispatchEvent(event);
            }
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {}} // Prevent closing without login
        onLogin={handleLogin}
      />

      {showUserManagement && (
        <UserManagement
          currentUser={currentUser}
          onClose={() => setShowUserManagement(false)}
        />
      )}
    </div>
    </>
  );
}
