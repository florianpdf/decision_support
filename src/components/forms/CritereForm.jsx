import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Tooltip from '../Tooltip';
import { CRITERION_TYPES, DEFAULT_CRITERION_TYPE, CRITERION_TYPE_LABELS, CRITERION_TYPE_COLORS } from '../../utils/constants';

/**
 * Form component for adding a new key motivation to a professional interest
 */
function CritereForm({ categoryId, onSubmit, onCancel }) {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState(1);
    const [type, setType] = useState(DEFAULT_CRITERION_TYPE);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Veuillez saisir un nom pour la motivation clé');
            return;
        }

        onSubmit({
            name: name.trim(),
            weight: weight, // Slider already guarantees a value between 1 and 30
            type: type,
        });

        // Reset form
        setName('');
        setWeight(1);
        setType(DEFAULT_CRITERION_TYPE);
    };

    return (
        <form onSubmit={handleSubmit} className="critere-form-inline">
            <div style={{ marginBottom: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '10px', fontSize: '0.9rem', color: '#495057' }}>
                💡 <strong>Astuce :</strong> L'importance détermine la taille du carré dans le graphique. Plus l'importance est élevée, plus le carré sera grand.
            </div>
            
            <div className="form-group">
                <label htmlFor={`criterion-name-${categoryId}`}>
                    📝 Nom de la motivation clé <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                </label>
                <input
                    type="text"
                    id={`criterion-name-${categoryId}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Autonomie, Équipe, Innovation, Stabilité..."
                    required
                    aria-required="true"
                    aria-describedby={`criterion-name-help-${categoryId}`}
                />
                <small id={`criterion-name-help-${categoryId}`} style={{ display: 'none' }}>
                    Nom de la motivation clé
                </small>
            </div>

            <div className="form-group">
                <label htmlFor={`criterion-weight-${categoryId}`}>
                    ⚖️ Importance de la motivation clé (1-30) <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <div style={{ padding: '15px 0' }}>
                    <Slider
                        id={`criterion-weight-${categoryId}`}
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

            <div className="form-group">
                <fieldset>
                    <legend>
                        🎯 Type de motivation clé <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                    </legend>
                    <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#7f8c8d' }}>
                        Sélectionnez le type qui correspond à cette motivation clé
                    </div>
                    <div role="radiogroup" aria-label="Type de motivation clé">
                        {Object.values(CRITERION_TYPES).map((criterionType) => {
                            const isSelected = type === criterionType;
                            const label = CRITERION_TYPE_LABELS[criterionType];
                            const color = CRITERION_TYPE_COLORS[criterionType];
                            const inputId = `criterion-type-${categoryId}-${criterionType}`;
                            
                            return (
                                <label
                                    key={criterionType}
                                    htmlFor={inputId}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px',
                                        marginBottom: '8px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
                                        border: `2px solid ${isSelected ? color : 'transparent'}`,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        id={inputId}
                                        name={`criterion-type-${categoryId}`}
                                        value={criterionType}
                                        checked={isSelected}
                                        onChange={(e) => setType(e.target.value)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '4px',
                                            backgroundColor: color,
                                            marginRight: '10px',
                                            border: '1px solid #ddd'
                                        }}
                                    />
                                    <span>{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </fieldset>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-small" style={{ flex: 1 }}>
                    ➕ Ajouter la motivation clé
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

export default CritereForm;
