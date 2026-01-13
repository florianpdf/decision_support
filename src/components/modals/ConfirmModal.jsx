import React, { useState } from 'react';

/**
 * Modal component for confirmations
 */
function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  requireCheckbox = false,
  checkboxLabel = '',
  type = 'danger' // 'danger' | 'warning' | 'info'
}) {
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (requireCheckbox && !checkboxChecked) {
      return;
    }
    onConfirm();
    setCheckboxChecked(false);
  };

  const handleClose = () => {
    setCheckboxChecked(false);
    onClose();
  };

  const typeStyles = {
    danger: {
      borderColor: '#e74c3c',
      confirmBg: '#e74c3c',
      confirmHover: '#c0392b'
    },
    warning: {
      borderColor: '#f39c12',
      confirmBg: '#f39c12',
      confirmHover: '#d68910'
    },
    info: {
      borderColor: '#3498db',
      confirmBg: '#3498db',
      confirmHover: '#2980b9'
    }
  };

  const styles = typeStyles[type];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: `4px solid ${styles.borderColor}` }}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        {requireCheckbox && (
          <div className="modal-checkbox">
            <label>
              <input
                type="checkbox"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <span>{checkboxLabel}</span>
            </label>
          </div>
        )}

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
          >
            {cancelText}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={requireCheckbox && !checkboxChecked}
            style={{
              background: requireCheckbox && !checkboxChecked ? '#ccc' : styles.confirmBg,
              borderColor: requireCheckbox && !checkboxChecked ? '#ccc' : styles.confirmBg
            }}
            onMouseEnter={(e) => {
              if (!(requireCheckbox && !checkboxChecked)) {
                e.target.style.background = styles.confirmHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!(requireCheckbox && !checkboxChecked)) {
                e.target.style.background = styles.confirmBg;
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
