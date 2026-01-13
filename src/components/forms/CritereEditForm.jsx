import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Tooltip from '../Tooltip';

/**
 * Form component for editing an existing key motivation
 */
function CritereEditForm({ critere, onSubmit, onCancel }) {
    const [name, setName] = useState(critere?.name || '');
    const [weight, setWeight] = useState(critere?.weight || 15);

    useEffect(() => {
        setName(critere?.name || '');
        setWeight(critere?.weight || 15);
    }, [critere]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Veuillez saisir un nom pour la motivation clé');
            return;
        }

        onSubmit({
            name: name.trim(),
            weight: weight,
        });
    };

    if (!critere) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit} className="critere-edit-form">
            <div className="form-group">
                <label htmlFor={`edit-criterion-name-${critere.id}`}>
                    📝 Nom de la motivation clé <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                </label>
                <input
                    type="text"
                    id={`edit-criterion-name-${critere.id}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Autonomie, Équipe, Innovation, Stabilité..."
                    required
                    aria-required="true"
                />
            </div>

            <div className="form-group">
                <label htmlFor={`edit-criterion-weight-${critere.id}`}>
                    ⚖️ Importance de la motivation clé (1-30) <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <div style={{ padding: '15px 0' }}>
                    <Slider
                        id={`edit-criterion-weight-${critere.id}`}
                        value={weight}
                        onChange={(e, newValue) => {
                            setWeight(newValue);
                        }}
                        min={1}
                        max={30}
                        step={1}
                        valueLabelDisplay="auto"
                        aria-label="Importance de la motivation clé"
                        marks
                    />
                </div>
                <div style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    background: '#e3f2fd', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1976d2'
                }}>
                    Importance sélectionnée : {weight}
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-small" style={{ flex: 1 }}>
                    💾 Enregistrer
                </button>
                {onCancel && (
                    <Tooltip content="Annuler">
                        <button type="button" className="btn-icon btn-icon-secondary" onClick={onCancel}>
                            ✖️
                        </button>
                    </Tooltip>
                )}
            </div>
        </form>
    );
}

export default CritereEditForm;
