"use client";

import React, { useState } from "react";

export default function AbhiBuddy({ environment, categories, onDataUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hi! I\'m AbhiBuddy 🤖\n\nCommands:\n• "add category NAME"\n• "add report NAME to CATEGORY"\n• "delete category NAME"\n• "delete report NAME"\n\nSuper simple!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.toLowerCase();
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
    setLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      try {
        let action = null;
        
        // Smart pattern matching (No external AI!)
        if (userMessage.includes('add') && userMessage.includes('category')) {
          // Extract category name after 'category'
          const parts = userMessage.split('category');
          if (parts[1]) {
            const name = parts[1].trim().replace(/[^a-zA-Z0-9\s]/g, '');
            if (name) {
              action = { action: 'add_category', name: name };
            }
          }
        } else if (userMessage.includes('add') && userMessage.includes('report')) {
          // Extract report name and category
          const reportMatch = userMessage.match(/add.*report\s+([^\s]+(?:\s+[^\s]+)*)\s+(?:to|in)\s+([^\s]+(?:\s+[^\s]+)*)/i);
          if (reportMatch) {
            action = { action: 'add_report', name: reportMatch[1].trim(), category: reportMatch[2].trim() };
          }
        } else if (userMessage.includes('delete') && userMessage.includes('category')) {
          const parts = userMessage.split('category');
          if (parts[1]) {
            const name = parts[1].trim().replace(/[^a-zA-Z0-9\s]/g, '');
            if (name) {
              action = { action: 'delete_category', name: name };
            }
          }
        } else if (userMessage.includes('delete') && userMessage.includes('report')) {
          const parts = userMessage.split('report');
          if (parts[1]) {
            const name = parts[1].trim().replace(/[^a-zA-Z0-9\s]/g, '');
            if (name) {
              action = { action: 'delete_report', name: name };
            }
          }
        }

        if (action) {
          executeAction(action);
        } else {
          // Default responses
          const responses = [
            'Please use: "add category NAME" or "add report NAME to CATEGORY"',
            'I can help you add/delete categories and reports. Try: "add category Reports"',
            'Commands: add/delete category NAME, add/delete report NAME'
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          setMessages(prev => [...prev, { type: 'ai', text: randomResponse }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { type: 'ai', text: 'Please try again with correct format.' }]);
      } finally {
        setLoading(false);
      }
    }, 800); // Simulate AI response time
  };

  const executeAction = async (action) => {
    try {
      switch (action.action) {
        case 'add_category':
          const catResponse = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: action.name,
              environment,
              order: categories.length + 1
            })
          });
          if (catResponse.ok) {
            setMessages(prev => [...prev, { type: 'ai', text: `✅ Added category "${action.name}" successfully!` }]);
            onDataUpdate();
          } else {
            setMessages(prev => [...prev, { type: 'ai', text: `❌ Failed to add category "${action.name}"` }]);
          }
          break;

        case 'add_report':
          const category = categories.find(c => c.name.toLowerCase().includes(action.category.toLowerCase()));
          if (!category) {
            setMessages(prev => [...prev, { type: 'ai', text: `❌ Category "${action.category}" not found` }]);
            return;
          }
          
          const reportResponse = await fetch('/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: action.name,
              category: category._id,
              environment,
              status: 'not-started',
              order: 99
            })
          });
          if (reportResponse.ok) {
            setMessages(prev => [...prev, { type: 'ai', text: `✅ Added report "${action.name}" to "${category.name}" successfully!` }]);
            onDataUpdate();
          } else {
            setMessages(prev => [...prev, { type: 'ai', text: `❌ Failed to add report "${action.name}"` }]);
          }
          break;

        case 'delete_category':
          const categoryToDelete = categories.find(c => c.name.toLowerCase().includes(action.name.toLowerCase()));
          if (!categoryToDelete) {
            setMessages(prev => [...prev, { type: 'ai', text: `❌ Category "${action.name}" not found` }]);
            return;
          }
          const delCatResponse = await fetch(`/api/categories/${categoryToDelete._id}`, {
            method: 'DELETE'
          });
          if (delCatResponse.ok) {
            setMessages(prev => [...prev, { type: 'ai', text: `✅ Category "${categoryToDelete.name}" deleted!` }]);
            onDataUpdate();
          } else {
            setMessages(prev => [...prev, { type: 'ai', text: `❌ Failed to delete category` }]);
          }
          break;

        case 'delete_report':
          let reportToDelete = null;
          let parentCategory = null;
          categories.forEach(cat => {
            const report = cat.reports?.find(r => r.name.toLowerCase().includes(action.name.toLowerCase()));
            if (report) {
              reportToDelete = report;
              parentCategory = cat;
            }
          });
          if (!reportToDelete) {
            setMessages(prev => [...prev, { type: 'ai', text: `❌ Report "${action.name}" not found` }]);
            return;
          }
          const delReportResponse = await fetch(`/api/reports/${reportToDelete._id}`, {
            method: 'DELETE'
          });
          if (delReportResponse.ok) {
            setMessages(prev => [...prev, { type: 'ai', text: `✅ Report "${reportToDelete.name}" deleted!` }]);
            onDataUpdate();
          } else {
            setMessages(prev => [...prev, { type: 'ai', text: `❌ Failed to delete report` }]);
          }
          break;

        default:
          setMessages(prev => [...prev, { type: 'ai', text: 'I understand, but I need more specific information to help you.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', text: 'Sorry, something went wrong while processing your request.' }]);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #1e5799 0%, #207cca 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          animation: 'float 3s ease-in-out infinite, pulse 2s infinite'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>
      
      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(30, 87, 153, 0.7); }
          70% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 10px rgba(30, 87, 153, 0); }
          100% { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(30, 87, 153, 0); }
        }
      `}</style>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e5799 0%, #207cca 100%)',
            color: 'white',
            padding: '15px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            🤖 AbhiBuddy - AI Assistant
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.type === 'user' ? '#1e5799' : '#f0f0f0',
                  color: msg.type === 'user' ? 'white' : '#333',
                  padding: '10px 12px',
                  borderRadius: '15px',
                  maxWidth: '80%',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#f0f0f0',
                padding: '10px 12px',
                borderRadius: '15px',
                fontSize: '14px'
              }}>
                🤖 Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '15px',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="add/delete category NAME or add/delete report NAME"
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                fontSize: '14px',
                outline: 'none'
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
              style={{
                background: '#1e5799',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}