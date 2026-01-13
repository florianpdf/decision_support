import React, { useState, useEffect } from 'react';
import IconButton from '../ui/IconButton';

/**
 * Form component for editing an existing key motivation
 * Only allows editing the name of the criterion
 */
function CritereEditForm({ critere, onSubmit, onCancel, categoryColor }) {
    const [name, setName] = useState(critere?.name || '');

    useEffect(() => {
        setName(critere?.name || '');
    }, [critere]);

    const handleSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        if (!name.trim()) {
            alert('Veuillez saisir un nom pour la motivation clé');
            return;
        }

        onSubmit({
            name: name.trim()
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
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        id={`edit-criterion-name-${critere.id}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Autonomie, Équipe, Innovation, Stabilité..."
                        required
                        aria-required="true"
                        style={{ flex: 1 }}
                    />
                    <IconButton
                        icon="💾"
                        onClick={handleSubmit}
                        tooltip="Enregistrer les modifications"
                        ariaLabel="Enregistrer les modifications"
                        style={{ color: categoryColor || '#5568d3' }}
                        className="btn-icon-category"
                    />
                    {onCancel && (
                        <IconButton
                            icon="✖️"
                            onClick={onCancel}
                            tooltip="Annuler"
                            ariaLabel="Annuler"
                            style={{ color: categoryColor || '#5568d3' }}
                            className="btn-icon-category"
                        />
                    )}
                </div>
            </div>
        </form>
    );
}

export default React.memo(CritereEditForm);
