import React, { useState, useEffect } from 'react';

/**
 * Component for renaming a profession or creating a new one
 */
function ProfessionRenameForm({ profession, onSubmit, onCancel }) {
  const [name, setName] = useState(profession?.name || '');

  useEffect(() => {
    setName(profession?.name || '');
  }, [profession]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Veuillez saisir un nom pour le métier');
      return;
    }
    
    onSubmit(name.trim());
  };

  // Allow form to be displayed even when profession is null (for creating new profession)

  return (
    <form onSubmit={handleSubmit} className="profession-rename-form">
      <div className="form-group">
        <label htmlFor="profession-rename-name">
          📋 Nom du métier <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
        </label>
        <input
          type="text"
          id="profession-rename-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Développeur, Manager, Consultant..."
          required
          aria-required="true"
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          {profession ? '💾 Enregistrer' : '➕ Créer le métier'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default ProfessionRenameForm;
