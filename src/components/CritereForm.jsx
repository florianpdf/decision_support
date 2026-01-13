import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Tooltip from './Tooltip';

/**
 * Composant formulaire pour ajouter une nouvelle motivation clé à un intérêt professionnel
 */
function CritereForm({ categoryId, onSubmit, onCancel }) {
    const [nom, setNom] = useState('');
    const [poids, setPoids] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!nom.trim()) {
            alert('Veuillez saisir un nom pour la motivation clé');
            return;
        }

        onSubmit({
            nom: nom.trim(),
            poids: poids, // Le slider garantit déjà une valeur entre 1 et 30
        });

        // Réinitialiser le formulaire
        setNom('');
        setPoids(1);
    };

    return (
        <form onSubmit={handleSubmit} className="critere-form-inline">
            <div style={{ marginBottom: '20px', padding: '12px', background: '#f8f9fa', borderRadius: '10px', fontSize: '0.9rem', color: '#495057' }}>
                💡 <strong>Astuce :</strong> L'importance détermine la taille du carré dans le graphique. Plus l'importance est élevée, plus le carré sera grand.
            </div>
            
            <div className="form-group">
                <label htmlFor={`critere-nom-${categoryId}`}>
                    📝 Nom de la motivation clé <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                </label>
                <input
                    type="text"
                    id={`critere-nom-${categoryId}`}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Autonomie, Équipe, Innovation, Stabilité..."
                    required
                    aria-required="true"
                    aria-describedby={`critere-nom-help-${categoryId}`}
                />
                <small id={`critere-nom-help-${categoryId}`} style={{ display: 'none' }}>
                    Nom de la motivation clé
                </small>
            </div>

            <div className="form-group">
                <label htmlFor={`critere-poids-${categoryId}`}>
                    ⚖️ Importance de la motivation clé (1-30) <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <div style={{ padding: '15px 0' }}>
                    <Slider
                        id={`critere-poids-${categoryId}`}
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
