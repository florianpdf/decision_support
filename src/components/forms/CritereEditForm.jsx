import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Tooltip from '../Tooltip';

/**
 * Composant formulaire pour modifier une motivation clé existante
 */
function CritereEditForm({ critere, onSubmit, onCancel }) {
    const [nom, setNom] = useState(critere.nom);
    const [poids, setPoids] = useState(critere.poids);

    // Mettre à jour les valeurs si la motivation clé change
    useEffect(() => {
        setNom(critere.nom);
        setPoids(critere.poids);
    }, [critere]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!nom.trim()) {
            alert('Veuillez saisir un nom pour la motivation clé');
            return;
        }

        onSubmit({
            id: critere.id,
            nom: nom.trim(),
            poids: poids, // Le slider garantit déjà une valeur entre 1 et 30
        });
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
                <label htmlFor={`edit-nom-${critere.id}`}>
                    📝 Nom de la motivation clé <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                </label>
                <input
                    type="text"
                    id={`edit-nom-${critere.id}`}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Autonomie, Équipe, Innovation..."
                    required
                    aria-required="true"
                    aria-describedby={`edit-nom-help-${critere.id}`}
                />
                <small id={`edit-nom-help-${critere.id}`} style={{ display: 'none' }}>
                    Nom de la motivation clé
                </small>
            </div>

            <div className="form-group">
                <label htmlFor={`edit-poids-${critere.id}`}>
                    ⚖️ Importance de la motivation clé (1-30) <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <div style={{ padding: '15px 0' }}>
                    <Slider
                        id={`edit-poids-${critere.id}`}
                        value={poids}
                        onChange={(e, newValue) => {
                            setPoids(newValue);
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
                    Importance sélectionnée : {poids}
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-small" style={{ flex: 1 }}>
                    💾 Enregistrer
                </button>
                <Tooltip content="Annuler">
                    <button 
                        type="button" 
                        className="btn-icon btn-icon-secondary"
                        onClick={onCancel}
                    >
                        ✖️
                    </button>
                </Tooltip>
            </div>
        </form>
    );
}

export default CritereEditForm;
