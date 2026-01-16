/**
 * Modal for recommendation configuration
 */

import React from 'react';
import PropTypes from 'prop-types';
import RecommendationConfig from '../comparison/RecommendationConfig';

/**
 * Recommendation configuration modal
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Object} props.preferences - Current preferences object
 * @param {Function} props.onPreferencesChange - Callback when preferences change
 * @param {Array} props.professionIds - Array of profession IDs to get categories from
 */
function RecommendationConfigModal({ isOpen, onClose, preferences, onPreferencesChange, professionIds }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f0f0f0',
            color: '#7f8c8d',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
            e.currentTarget.style.color = '#2c3e50';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.color = '#7f8c8d';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{
          padding: '30px 30px 20px 30px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>⚙️</span>
            <span>Configuration de la recommandation</span>
          </h2>
          <p style={{
            margin: '10px 0 0 0',
            color: '#5a6268',
            fontSize: '0.95rem'
          }}>
            Personnalisez les critères utilisés pour la recommandation
          </p>
        </div>

        {/* Config Content */}
        <RecommendationConfig
          preferences={preferences}
          onPreferencesChange={onPreferencesChange}
          professionIds={professionIds}
        />

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#5568d3',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4455b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5568d3';
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

RecommendationConfigModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  preferences: PropTypes.object,
  onPreferencesChange: PropTypes.func.isRequired,
  professionIds: PropTypes.arrayOf(PropTypes.number)
};

export default RecommendationConfigModal;
