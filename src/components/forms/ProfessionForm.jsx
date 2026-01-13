import React, { useState } from 'react';

/**
 * Component for creating a new profession
 */
function ProfessionForm({ onSubmit, onCancel, existingProfessions = [] }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a name for the profession');
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
          📋 Profession Name <span style={{ color: '#e74c3c' }} aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="profession-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Developer, Manager, Consultant..."
          required
          aria-required="true"
          aria-describedby="profession-name-help"
        />
        <small id="profession-name-help" style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
          Choose a name that describes the profession well
        </small>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          ➕ Create Profession
        </button>
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProfessionForm;
