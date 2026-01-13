import React, { useState, useEffect } from 'react';
import { COLOR_PALETTE, DEFAULT_COLOR } from '../../constants/colors';
import Tooltip from '../Tooltip';

/**
 * Form component for adding a new category
 */
function CategoryForm({ onSubmit, existingCategories = [] }) {
    // Get already used colors
    const usedColors = existingCategories.map(cat => cat.color || cat.couleur).filter(Boolean);
    
    // Filter palette to keep only available colors
    const availableColors = COLOR_PALETTE.filter(color => !usedColors.includes(color));
    
    // If no color is available, use first from default palette
    // Otherwise, use first available color
    const defaultAvailableColor = availableColors.length > 0 ? availableColors[0] : DEFAULT_COLOR;
    
    // Initialize with available color if current color is no longer available
    const [name, setName] = useState('');
    const [color, setColor] = useState(
        usedColors.includes(DEFAULT_COLOR) ? defaultAvailableColor : DEFAULT_COLOR
    );
    
    // Update color if it becomes unavailable
    useEffect(() => {
        if (usedColors.includes(color) && availableColors.length > 0) {
            setColor(availableColors[0]);
        }
    }, [existingCategories, color, usedColors, availableColors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Please enter a name for the professional interest');
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
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="category-name">
                    📝 Professional Interest Name <span style={{ color: '#e74c3c' }} aria-label="required">*</span>
                </label>
                <input
                    type="text"
                    id="category-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Management, Innovation, Relationship, Technical..."
                    required
                    aria-required="true"
                    aria-describedby="category-name-help"
                />
                <small id="category-name-help" style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                    Choose a name that describes your professional interest well
                </small>
            </div>

            <div className="form-group">
                <fieldset>
                    <legend>
                        🎨 Professional Interest Color <span style={{ color: '#e74c3c' }} aria-label="required">*</span>
                    </legend>
                    <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#7f8c8d' }}>
                        Click on a color below to select it
                    </div>
                    <div className="color-presets-only" role="radiogroup" aria-label="Color selection">
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
                                        aria-label={`Color ${presetColor}${isSelected ? ', selected' : ''}`}
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
                            All colors are already used. Delete a professional interest to free up a color.
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
                ➕ Create Professional Interest
            </button>
        </form>
    );
}

export default CategoryForm;
