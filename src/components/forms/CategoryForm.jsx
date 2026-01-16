import React, { useState, useEffect, useMemo } from 'react';
import { COLOR_PALETTE, DEFAULT_COLOR } from '../../constants/colors';
import Tooltip from '../Tooltip';
import CategorySuggestionsModal from '../modals/CategorySuggestionsModal';
import IconButton from '../ui/IconButton';

/**
 * Form component for adding a new category
 */
function CategoryForm({ onSubmit, existingCategories = [] }) {
    // Get already used colors
    const usedColors = useMemo(() => 
        existingCategories.map(cat => cat.color).filter(Boolean),
        [existingCategories]
    );
    
    // Filter palette to keep only available colors
    const availableColors = useMemo(() => 
        COLOR_PALETTE.filter(color => !usedColors.includes(color)),
        [usedColors]
    );
    
    // Initialize with available color if current color is no longer available
    const [name, setName] = useState('');
    const [color, setColor] = useState(() => {
        const initialUsedColors = existingCategories.map(cat => cat.color).filter(Boolean);
        const initialAvailableColors = COLOR_PALETTE.filter(color => !initialUsedColors.includes(color));
        const initialDefaultColor = initialAvailableColors.length > 0 ? initialAvailableColors[0] : DEFAULT_COLOR;
        return initialUsedColors.includes(DEFAULT_COLOR) ? initialDefaultColor : DEFAULT_COLOR;
    });
    
    // Modal state for suggestions
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
    
    // Update color if it becomes unavailable
    useEffect(() => {
        if (usedColors.includes(color) && availableColors.length > 0) {
            setColor(availableColors[0]);
        }
    }, [color, usedColors, availableColors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Veuillez saisir un nom pour l\'intérêt professionnel');
            return;
        }
        
        onSubmit({
            name: name.trim(),
            color: color,
        });

        // Reset form with available color
        setName('');
        const remainingUsedColors = [...usedColors, color];
        const remainingAvailableColors = COLOR_PALETTE.filter(color => !remainingUsedColors.includes(color));
        setColor(remainingAvailableColors.length > 0 ? remainingAvailableColors[0] : DEFAULT_COLOR);
    };

    const handleColorPresetClick = (selectedColor) => {
        setColor(selectedColor);
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <Tooltip 
                    content="Voir les suggestions d'intérêts professionnels"
                    position="top"
                >
                    <label htmlFor="category-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'help' }}>
                        <span>📝 Nom de l'intérêt professionnel <span style={{ color: '#e74c3c' }} aria-label="requis">*</span></span>
                        <IconButton
                            icon="💡"
                            onClick={() => setShowSuggestionsModal(true)}
                            ariaLabel="Voir les suggestions"
                            style={{ flexShrink: 0 }}
                        />
                    </label>
                </Tooltip>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        id="category-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Management, Innovation, Relationnel, Technique..."
                        required
                        aria-required="true"
                        aria-describedby="category-name-help"
                        style={{ flex: 1 }}
                    />
                </div>
                <small id="category-name-help" style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
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
                        availableColors.map((presetColor, index) => {
                            const isSelected = color === presetColor;
                            return (
                                <Tooltip 
                                    key={index} 
                                    content={presetColor} 
                                    position="top"
                                >
                                    <div
                                        className={`color-preset ${isSelected ? 'active' : ''}`}
                                        style={{ backgroundColor: presetColor }}
                                        onClick={() => handleColorPresetClick(presetColor)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleColorPresetClick(presetColor);
                                            }
                                        }}
                                        role="radio"
                                        aria-checked={isSelected}
                                        aria-label={`Couleur ${presetColor}${isSelected ? ', sélectionnée' : ''}`}
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
                    background: color,
                    border: `2px solid ${color}`,
                    opacity: availableColors.length === 0 ? 0.5 : 1,
                    cursor: availableColors.length === 0 ? 'not-allowed' : 'pointer'
                }}
            >
                ➕ Créer l'intérêt professionnel
            </button>
        </form>

        <CategorySuggestionsModal
            isOpen={showSuggestionsModal}
            onClose={() => setShowSuggestionsModal(false)}
            onSelect={(suggestion) => setName(suggestion)}
            existingCategories={existingCategories}
        />
        </>
    );
}

export default React.memo(CategoryForm);
