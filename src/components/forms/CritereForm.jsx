import React, { useState } from 'react';
import Tooltip from '../Tooltip';
import CriterionWeightAndType from '../ui/CriterionWeightAndType';
import { DEFAULT_CRITERION_TYPE } from '../../utils/constants';

/**
 * Form component for adding a new key motivation to a professional interest
 */
function CritereForm({ categoryId, onSubmit, onCancel }) {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState(15);
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
        setWeight(15);
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

            <div>
                <label htmlFor={`criterion-weight-${categoryId}`} style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '0.95rem' }}>
                    ⚖️ Importance de la motivation clé (1-30) <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <CriterionWeightAndType
                    weight={weight}
                    type={type}
                    onWeightChange={(newValue) => {
                        setWeight(newValue);
                    }}
                    onTypeChange={(newType) => setType(newType)}
                    categoryColor={undefined}
                    showWeightLabel={false}
                    showWeightValue={true}
                    namePrefix={`criterion-type-${categoryId}`}
                    weightId={`criterion-weight-${categoryId}`}
                />
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

export default React.memo(CritereForm);
