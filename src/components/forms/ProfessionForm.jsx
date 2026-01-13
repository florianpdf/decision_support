import React, { useState } from 'react';

/**
 * Component for creating a new profession
 */
function ProfessionForm({ onSubmit, onCancel, existingProfessions = [] }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Veuillez saisir un nom pour le métier');
      return;
    }
    
    onSubmit({
      name: name.trim(),
    });

    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="profession-form">
      <div className="form-group">
        <label htmlFor="profession-name">
          📋 Nom du métier <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
        </label>
        <input
          type="text"
          id="profession-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Développeur, Manager, Consultant..."
          required
          aria-required="true"
          aria-describedby="profession-name-help"
        />
        <small id="profession-name-help" style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
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

export default ProfessionForm;
