import React, { useState, useEffect } from 'react';

/**
 * Component for renaming a metier
 */
function MetierRenameForm({ metier, onSubmit, onCancel }) {
  const [nom, setNom] = useState(metier?.nom || '');

  useEffect(() => {
    setNom(metier?.nom || '');
  }, [metier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nom.trim()) {
      alert('Veuillez saisir un nom pour le métier');
      return;
    }
    
    onSubmit(nom.trim());
  };

  if (!metier) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="metier-rename-form">
      <div className="form-group">
        <label htmlFor="metier-rename-nom">
          📋 Nom du métier <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
        </label>
        <input
          type="text"
          id="metier-rename-nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
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
          💾 Enregistrer
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

export default MetierRenameForm;
