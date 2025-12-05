"use client";

import React, { useState } from "react";

export default function CategorySidebar({ categories, onCategoryClick, isEditMode, onAddCategory }) {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      onCategoryClick && onCategoryClick(categoryId);
    }
  };

  return (
    <>
      {/* Hide Button in Header */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '200px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      )}
      
      {/* Show Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1e5799',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: isOpen ? '0' : '-250px',
          top: '0',
          width: '250px',
          height: '100vh',
          background: 'linear-gradient(135deg, #1e5799 0%, #207cca 100%)',
          color: 'white',
          padding: '20px',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          display: window.innerWidth <= 768 && !isOpen ? 'none' : 'block'
        }}
      >
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '18px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
          paddingBottom: '10px'
        }}>
          📋 Categories
        </h3>
        
        {isEditMode && (
          <button
            onClick={() => {
              // This will trigger the manual add modal
              const event = new CustomEvent('openManualAdd');
              window.dispatchEvent(event);
            }}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            📝 Add Reports Manually
          </button>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((category, index) => (
            <button
              key={category._id}
              onClick={() => scrollToCategory(category._id)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

    </>
  );
}