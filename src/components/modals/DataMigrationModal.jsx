import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

/**
 * Modal component for data migration notification
 * Informs user about data structure changes and offers to reset localStorage
 */
function DataMigrationModal({ 
  isOpen, 
  onClose, 
  onReset,
  storedVersion,
  currentVersion,
  canReset = true
}) {
  const [showInstructions, setShowInstructions] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    onClose();
  };

  const resetInstructions = (
    <div style={{ 
      marginTop: '20px', 
      padding: '15px', 
      background: '#f8f9fa', 
      borderRadius: '8px',
      fontSize: '0.9rem',
      lineHeight: '1.6'
    }}>
      <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1rem', fontWeight: '600' }}>
        📋 Instructions pour réinitialiser manuellement :
      </h4>
      <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
        <li style={{ marginBottom: '8px' }}>
          Ouvrez les outils de développement de votre navigateur :
          <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
            <li><strong>Chrome/Edge</strong> : Appuyez sur <code>F12</code> ou <code>Ctrl+Shift+I</code></li>
            <li><strong>Firefox</strong> : Appuyez sur <code>F12</code> ou <code>Ctrl+Shift+I</code></li>
            <li><strong>Safari</strong> : Appuyez sur <code>Cmd+Option+I</code></li>
          </ul>
        </li>
        <li style={{ marginBottom: '8px' }}>
          Allez dans l'onglet <strong>Console</strong>
        </li>
        <li style={{ marginBottom: '8px' }}>
          Copiez et collez cette commande, puis appuyez sur <code>Entrée</code> :
          <div style={{ 
            marginTop: '8px', 
            padding: '10px', 
            background: '#2c3e50', 
            color: '#ecf0f1',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            overflowX: 'auto'
          }}>
            <code>localStorage.clear(); location.reload();</code>
          </div>
        </li>
        <li>
          La page se rechargera automatiquement avec des données vides
        </li>
      </ol>
    </div>
  );

  const message = (
    <div>
      <p style={{ marginBottom: '15px' }}>
        La structure des données de l'application a changé depuis votre dernière visite.
      </p>
      <p style={{ marginBottom: '15px' }}>
        <strong>Version actuelle :</strong> {currentVersion}<br />
        {storedVersion && (
          <>
            <strong>Votre version :</strong> {storedVersion}
          </>
        )}
        {!storedVersion && (
          <>
            <strong>Votre version :</strong> Ancienne (avant le système de versioning)
          </>
        )}
      </p>
      <p style={{ marginBottom: '15px', color: '#e74c3c', fontWeight: '600' }}>
        ⚠️ Pour que l'application fonctionne correctement, vous devez réinitialiser vos données.
        <strong> Cette action supprimera toutes vos données locales.</strong>
      </p>
      
      {canReset ? (
        <p style={{ marginBottom: '15px', color: '#27ae60', fontWeight: '600' }}>
          ✅ Vous pouvez réinitialiser automatiquement en cliquant sur le bouton ci-dessous.
        </p>
      ) : (
        <>
          <p style={{ marginBottom: '15px', color: '#e67e22', fontWeight: '600' }}>
            ⚠️ La réinitialisation automatique n'est pas disponible dans votre navigateur.
          </p>
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            style={{
              padding: '8px 16px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            {showInstructions ? 'Masquer' : 'Afficher'} les instructions
          </button>
          {showInstructions && resetInstructions}
        </>
      )}
    </div>
  );

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={canReset ? handleReset : undefined}
      title="⚠️ Mise à jour de la structure des données"
      message={message}
      confirmText={canReset ? "Réinitialiser les données" : undefined}
      cancelText={canReset ? "Annuler" : "Fermer"}
      requireCheckbox={canReset}
      checkboxLabel="Je comprends que toutes mes données seront supprimées et que je vais tout perdre"
      type="warning"
    />
  );
}

export default DataMigrationModal;
