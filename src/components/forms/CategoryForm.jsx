import React, { useState, useEffect } from 'react';
import { COLOR_PALETTE, DEFAULT_COLOR } from '../../constants/colors';
import Tooltip from '../Tooltip';

/**
 * Composant formulaire pour ajouter une nouvelle catégorie
 */
function CategoryForm({ onSubmit, existingCategories = [] }) {
    // Récupérer les couleurs déjà utilisées
    const usedColors = existingCategories.map(cat => cat.couleur);
    
    // Filtrer la palette pour ne garder que les couleurs disponibles
    const availableColors = COLOR_PALETTE.filter(color => !usedColors.includes(color));
    
    // Si aucune couleur n'est disponible, utiliser la première de la palette par défaut
    // Sinon, utiliser la première couleur disponible
    const defaultAvailableColor = availableColors.length > 0 ? availableColors[0] : DEFAULT_COLOR;
    
    // Initialiser avec une couleur disponible si la couleur actuelle n'est plus disponible
    const [nom, setNom] = useState('');
    const [couleur, setCouleur] = useState(
        usedColors.includes(DEFAULT_COLOR) ? defaultAvailableColor : DEFAULT_COLOR
    );
    
    // Mettre à jour la couleur si elle devient indisponible
    useEffect(() => {
        if (usedColors.includes(couleur) && availableColors.length > 0) {
            setCouleur(availableColors[0]);
        }
    }, [existingCategories, couleur, usedColors, availableColors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!nom.trim()) {
            alert('Veuillez saisir un nom pour l\'intérêt professionnel');
            return;
        }
        
        onSubmit({
            nom: nom.trim(),
            couleur: couleur,
        });

        // Réinitialiser le formulaire avec une couleur disponible
        setNom('');
        const remainingUsedColors = [...usedColors, couleur];
        const remainingAvailableColors = COLOR_PALETTE.filter(color => !remainingUsedColors.includes(color));
        setCouleur(remainingAvailableColors.length > 0 ? remainingAvailableColors[0] : DEFAULT_COLOR);
    };

    const handleColorPresetClick = (color) => {
        setCouleur(color);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="nom">
                    📝 Nom de l'intérêt professionnel <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                </label>
                <input
                    type="text"
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Management, Innovation, Relationnel, Technique..."
                    required
                    aria-required="true"
                    aria-describedby="nom-help"
                />
                <small id="nom-help" style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                    Choisissez un nom qui décrit bien votre intérêt professionnel
                </small>
            </div>

            <div className="form-group">
                <fieldset>
                    <legend>
                        🎨 Couleur de l'intérêt professionnel <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                    </legend>
                    <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#7f8c8d' }}>
                        Cliquez sur une couleur ci-dessous pour la sélectionner
                    </div>
                    <div className="color-presets-only" role="radiogroup" aria-label="Sélection de la couleur">
                    {availableColors.length > 0 ? (
                        availableColors.map((color, index) => {
                            const isSelected = couleur === color;
                            return (
                                <Tooltip 
                                    key={index} 
                                    content={color} 
                                    position="top"
                                >
                                    <div
                                        className={`color-preset ${isSelected ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorPresetClick(color)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleColorPresetClick(color);
                                            }
                                        }}
                                        role="radio"
                                        aria-checked={isSelected}
                                        aria-label={`Couleur ${color}${isSelected ? ', sélectionnée' : ''}`}
                                        tabIndex={0}
                                    />
                                </Tooltip>
                            );
                        })
                    ) : (
                        <div style={{ 
                            padding: '15px', 
                            textAlign: 'center', 
                            color: '#e74c3c',
                            fontWeight: '600'
                        }}>
                            Toutes les couleurs sont déjà utilisées. Supprimez un intérêt professionnel pour libérer une couleur.
                        </div>
                    )}
                    </div>
                </fieldset>
            </div>

            <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={availableColors.length === 0}
                style={{ 
                    width: '100%', 
                    justifyContent: 'center',
                    background: couleur,
                    border: `2px solid ${couleur}`,
                    opacity: availableColors.length === 0 ? 0.5 : 1,
                    cursor: availableColors.length === 0 ? 'not-allowed' : 'pointer'
                }}
            >
                ➕ Créer l'intérêt professionnel
            </button>
        </form>
    );
}

export default CategoryForm;
