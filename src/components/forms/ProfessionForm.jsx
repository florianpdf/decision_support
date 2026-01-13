import React, { useState } from 'react';

/**
 * Component for creating a new profession
 */
function ProfessionForm({ onSubmit, onCancel, existingProfessions = [], isFirstProfession = false }) {
  const [name, setName] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Veuillez saisir un nom pour le métier');
      return;
    }
    
    onSubmit({
      name: name.trim(),
      useTemplate: isFirstProfession && useTemplate
    });

    setName('');
    setUseTemplate(false);
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

      {isFirstProfession && (
        <div className="form-group" style={{ marginTop: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
              📋 Utiliser un modèle (10 intérêts professionnels avec 5 motivations clés chacun)
            </span>
          </label>
          <small style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block', marginLeft: '28px' }}>
            Cette option créera automatiquement des exemples d'intérêts professionnels et de motivations clés pour vous aider à démarrer
          </small>
        </div>
      )}

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
