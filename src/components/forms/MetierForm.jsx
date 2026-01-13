import React, { useState } from 'react';

/**
 * Component for creating a new metier
 */
function MetierForm({ onSubmit, onCancel, existingMetiers = [] }) {
  const [nom, setNom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nom.trim()) {
      alert('Veuillez saisir un nom pour le métier');
      return;
    }
    
    onSubmit({
      nom: nom.trim(),
    });

    setNom('');
  };

  return (
    <form onSubmit={handleSubmit} className="metier-form">
      <div className="form-group">
        <label htmlFor="metier-nom">
          📋 Nom du métier <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
        </label>
        <input
          type="text"
          id="metier-nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex: Développeur, Manager, Consultant..."
          required
          aria-required="true"
          aria-describedby="metier-nom-help"
        />
        <small id="metier-nom-help" style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
          Choisissez un nom qui décrit bien le métier
        </small>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          ➕ Créer le métier
        </button>
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

export default MetierForm;
