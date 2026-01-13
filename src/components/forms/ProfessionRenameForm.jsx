import React, { useState, useEffect } from 'react';

/**
 * Component for renaming a profession
 */
function ProfessionRenameForm({ profession, onSubmit, onCancel }) {
  const [name, setName] = useState(profession?.name || '');

  useEffect(() => {
    setName(profession?.name || '');
  }, [profession]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a name for the profession');
      return;
    }
    
    onSubmit(name.trim());
  };

  if (!profession) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="profession-rename-form">
      <div className="form-group">
        <label htmlFor="profession-rename-name">
          📋 Profession Name <span style={{ color: '#e74c3c' }} aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="profession-rename-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Developer, Manager, Consultant..."
          required
          aria-required="true"
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          💾 Save
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProfessionRenameForm;
