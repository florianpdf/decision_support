/**
 * Cookie consent modal component
 * Informs users about cookie usage and data privacy
 */

import React, { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'bulle_chart_cookie_consent';

/**
 * Check if user has already given consent
 */
export const hasCookieConsent = () => {
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    return consent === 'accepted';
  } catch (error) {
    return false;
  }
};

/**
 * Save cookie consent
 */
export const saveCookieConsent = (accepted) => {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? 'accepted' : 'rejected');
    return true;
  } catch (error) {
    console.error('Error saving cookie consent:', error);
    return false;
  }
};

/**
 * Cookie consent modal
 */
function CookieConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    if (!hasCookieConsent()) {
      // Small delay to ensure smooth rendering
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    saveCookieConsent(true);
    setIsOpen(false);
    // Load Google Analytics
    loadGoogleAnalytics();
  };

  const handleReject = () => {
    saveCookieConsent(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="modal-overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          borderTop: '4px solid #5568d3'
        }}
      >
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '20px', 
          fontSize: '1.5rem', 
          fontWeight: '700',
          color: '#2c3e50'
        }}>
          🍪 Gestion des cookies et confidentialité
        </h3>

        <div style={{ 
          marginBottom: '25px', 
          lineHeight: '1.7',
          color: '#34495e',
          fontSize: '0.95rem'
        }}>
          <p style={{ marginBottom: '15px' }}>
            <strong>Cookies d'analyse (Google Analytics)</strong>
          </p>
          <p style={{ marginBottom: '20px', paddingLeft: '15px' }}>
            Ce site utilise Google Analytics pour analyser l'utilisation de l'application. 
            Ces cookies nous aident à comprendre comment vous utilisez l'application et à l'améliorer.
          </p>

          <p style={{ marginBottom: '15px' }}>
            <strong>🔒 Confidentialité de vos données</strong>
          </p>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '4px solid #27ae60'
          }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#27ae60', marginBottom: '8px' }}>
              ✓ Vos données sont privées et sécurisées
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              <strong>Toutes vos données</strong> (métiers, intérêts professionnels, motivations clés) 
              sont stockées <strong>uniquement dans votre navigateur</strong> (localStorage). 
              Elles ne sont jamais envoyées à un serveur et personne d'autre que vous ne peut y accéder.
            </p>
          </div>

          <p style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#7f8c8d' }}>
            En acceptant, vous autorisez l'utilisation de cookies d'analyse. 
            Vous pouvez refuser, l'application fonctionnera normalement sans ces cookies.
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleReject}
            className="btn btn-secondary"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: '600',
              backgroundColor: '#5568d3',
              borderColor: '#5568d3'
            }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Load Google Analytics dynamically
 */
function loadGoogleAnalytics() {
  // Check if already loaded
  if (window.gtag) {
    return;
  }

  // Create script elements
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-NKQNSKNPDB';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-NKQNSKNPDB');
  `;
  document.head.appendChild(script2);
}

/**
 * Initialize Google Analytics if consent was given
 */
export const initializeGoogleAnalytics = () => {
  if (hasCookieConsent()) {
    loadGoogleAnalytics();
  }
};

export default CookieConsentModal;
