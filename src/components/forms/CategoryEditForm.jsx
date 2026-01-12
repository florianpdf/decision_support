import React, { useState, useEffect } from 'react';
import { COLOR_PALETTE } from '../../constants/colors';
import Tooltip from '../Tooltip';

/**
 * Form component for editing an existing category
 */
function CategoryEditForm({ category, onSubmit, onCancel, existingCategories = [] }) {
    // Get colors already used by other categories (excluding current category)
    const usedColors = existingCategories
        .filter(cat => cat.id !== category.id)
        .map(cat => cat.couleur);
    
    // Filter palette to show only available colors (excluding current category's color)
    const availableColors = COLOR_PALETTE.filter(color => 
        color === category.couleur || !usedColors.includes(color)
    );

    const [nom, setNom] = useState(category.nom);
    const [couleur, setCouleur] = useState(category.couleur);

    // Update color if it becomes unavailable
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
        
        onSubmit({ nom: nom.trim(), couleur: couleur });
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
                <label htmlFor={`edit-category-nom-${category.id}`}>
                    📝 Nom de l'intérêt professionnel <span style={{ color: '#e74c3c' }} aria-label="requis">*</span>
                </label>
                <input
                    type="text"
                    id={`edit-category-nom-${category.id}`}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Management, Innovation, Relationnel, Technique..."
                    required
                    aria-required="true"
                    aria-describedby={`edit-category-nom-help-${category.id}`}
                />
                <small id={`edit-category-nom-help-${category.id}`} style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
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
                        {availableColors.map((color, index) => {
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
                                        onClick={() => setCouleur(color)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setCouleur(color);
                                            }
                                        }}
                                        role="radio"
                                        aria-checked={isSelected}
                                        aria-label={`Couleur ${color}${isSelected ? ', sélectionnée' : ''}`}
                                        tabIndex={0}
                                    />
                                </Tooltip>
                            );
                        })}
                    </div>
                </fieldset>
            </div>

            <div className="form-actions">
                <button 
                    type="submit" 
                    className="btn btn-primary btn-small" 
                    style={{ 
                        flex: 1, 
                        justifyContent: 'center',
                        background: couleur,
                        border: `2px solid ${couleur}`
                    }}
                >
                    💾 Enregistrer
                </button>
                <Tooltip content="Annuler">
                    <button 
                        type="button" 
                        className="btn-icon btn-icon-secondary"
                        onClick={onCancel}
                        aria-label="Annuler la modification"
                    >
                        ✖️
                    </button>
                </Tooltip>
            </div>
        </form>
    );
}

export default CategoryEditForm;
