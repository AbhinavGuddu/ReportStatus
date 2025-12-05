'use client';

import React, { useState, useEffect } from 'react';

export default function TestingPanel({ environment, onClose }) {
  const [testers, setTesters] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTester, setNewTester] = useState({ name: '', email: '', expertise: [] });

  useEffect(() => {
    fetchTesters();
    fetchAssignments();
  }, [environment]);

  const fetchTesters = async () => {
    try {
      const response = await fetch('/api/testers');
      const result = await response.json();
      if (result.data) {
        setTesters(result.data);
      }
    } catch (error) {
      console.error('Error fetching testers:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/test-assignments?environment=${environment}`);
      const result = await response.json();
      if (result.data) {
        setAssignments(result.data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const addTester = async (e) => {
    e.preventDefault();
    if (!newTester.name || !newTester.email) return;

    setLoading(true);
    try {
      const response = await fetch('/api/testers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTester,
          environment: environment
        })
      });

      if (response.ok) {
        setNewTester({ name: '', email: '', expertise: [] });
        fetchTesters();
      }
    } catch (error) {
      console.error('Error adding tester:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAssignments = async () => {
    setLoading(true);
    try {
      // Get all completed reports that need testing
      const reportsResponse = await fetch(`/api/reports?environment=${environment}`);
      const reportsResult = await reportsResponse.json();
      
      const completedReports = [];
      reportsResult.data?.forEach(category => {
        category.reports?.forEach(report => {
          if (report.status === 'completed') {
            completedReports.push(report._id);
          }
        });
      });

      if (completedReports.length === 0) {
        alert('No completed reports found for testing assignment.');
        return;
      }

      const response = await fetch('/api/test-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportIds: completedReports,
          environment
        })
      });

      if (response.ok) {
        alert(`✅ Generated ${completedReports.length} test assignments!`);
        fetchAssignments();
      }
    } catch (error) {
      console.error('Error generating assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '30px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#1e5799', margin: 0 }}>🧪 Testing Management - {environment.toUpperCase()}</h2>
          <button onClick={onClose} style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Add Tester Form */}
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ color: '#1e5799', marginBottom: '15px' }}>👥 Add New Tester</h3>
          <form onSubmit={addTester} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
              <input
                type="text"
                value={newTester.name}
                onChange={(e) => setNewTester({ ...newTester, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
              <input
                type="email"
                value={newTester.email}
                onChange={(e) => setNewTester({ ...newTester, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
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
              {loading ? 'Adding...' : '➕ Add'}
            </button>
          </form>
        </div>

        {/* Testers List */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#1e5799', marginBottom: '15px' }}>👥 Active Testers ({testers.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
            {testers.map(tester => (
              <div key={tester._id} style={{
                background: '#f0f8ff',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #1e5799'
              }}>
                <div style={{ fontWeight: 'bold', color: '#1e5799' }}>{tester.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{tester.email}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                  Capacity: {tester.capacity} | Env: {tester.environment}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Assignments */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <button
            onClick={generateAssignments}
            disabled={loading || testers.length === 0}
            style={{
              background: testers.length === 0 ? '#ccc' : '#1e5799',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '15px 30px',
              cursor: testers.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {loading ? '⏳ Generating...' : '🎯 Generate Test Assignments'}
          </button>
          {testers.length === 0 && (
            <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '5px' }}>
              Add testers first to generate assignments
            </div>
          )}
        </div>

        {/* Current Assignments */}
        <div>
          <h3 style={{ color: '#1e5799', marginBottom: '15px' }}>📋 Current Test Assignments ({assignments.length})</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {assignments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No test assignments found. Generate assignments to get started.
              </div>
            ) : (
              assignments.map(assignment => (
                <div key={assignment._id} style={{
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{assignment.reportId?.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Assigned to: {assignment.testerId?.name} | 
                        Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: assignment.status === 'completed' ? '#d1fae5' : 
                                assignment.status === 'overdue' ? '#fecaca' : '#fef3c7',
                      color: assignment.status === 'completed' ? '#059669' : 
                            assignment.status === 'overdue' ? '#dc2626' : '#d97706'
                    }}>
                      {assignment.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}