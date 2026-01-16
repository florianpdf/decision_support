/**
 * Main navigation tabs component
 * Provides navigation between "Métier" and "Comparaison" views
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Navigation tabs component
 * @param {Object} props
 * @param {string} props.activeTab - Current active tab: 'main' or 'comparison'
 * @param {Function} props.onTabChange - Callback when tab changes
 * @param {number} props.professionCount - Number of professions
 */
function NavigationTabs({ activeTab, onTabChange, professionCount }) {
  const canAccessComparison = professionCount >= 2;

  return (
    <div style={{
      marginBottom: '30px',
      display: 'flex',
      gap: '12px',
      width: '100%'
    }}>
      <button
        onClick={() => onTabChange('main')}
        style={{
          flex: 1,
          padding: '16px 24px',
          border: `2px solid ${activeTab === 'main' ? '#5568d3' : '#e0e0e0'}`,
          backgroundColor: activeTab === 'main' ? '#5568d3' : '#ffffff',
          color: activeTab === 'main' ? '#ffffff' : '#2c3e50',
          fontWeight: '700',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: activeTab === 'main' ? '0 4px 12px rgba(85, 104, 211, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          if (activeTab !== 'main') {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.borderColor = '#5568d3';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== 'main') {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>💼</span>
        <span>Métier</span>
      </button>
      <button
        onClick={() => canAccessComparison && onTabChange('comparison')}
        disabled={!canAccessComparison}
        style={{
          flex: 1,
          padding: '16px 24px',
          border: `2px solid ${activeTab === 'comparison' ? '#5568d3' : '#e0e0e0'}`,
          backgroundColor: activeTab === 'comparison' ? '#5568d3' : '#ffffff',
          color: activeTab === 'comparison' ? '#ffffff' : (!canAccessComparison ? '#cccccc' : '#2c3e50'),
          fontWeight: '700',
          fontSize: '1.1rem',
          cursor: canAccessComparison ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: activeTab === 'comparison' ? '0 4px 12px rgba(85, 104, 211, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
          opacity: canAccessComparison ? 1 : 0.6,
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          if (canAccessComparison && activeTab !== 'comparison') {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.borderColor = '#5568d3';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (canAccessComparison && activeTab !== 'comparison') {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }
        }}
        title={!canAccessComparison ? 'Au moins 2 métiers sont nécessaires pour la comparaison' : 'Comparer les métiers'}
      >
        <span style={{ fontSize: '1.3rem' }}>📊</span>
        <span>Comparaison</span>
        {!canAccessComparison && (
          <span style={{
            marginLeft: '8px',
            fontSize: '0.85rem',
            opacity: 0.8
          }}>
            (min. 2)
          </span>
        )}
      </button>
    </div>
  );
}

NavigationTabs.propTypes = {
  activeTab: PropTypes.oneOf(['main', 'comparison']).isRequired,
  onTabChange: PropTypes.func.isRequired,
  professionCount: PropTypes.number.isRequired
};

export default NavigationTabs;
