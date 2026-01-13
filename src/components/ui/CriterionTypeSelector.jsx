import React from 'react';
import PropTypes from 'prop-types';
import { CRITERION_TYPES, CRITERION_TYPE_LABELS, CRITERION_TYPE_COLORS } from '../../utils/constants';

/**
 * Reusable component for selecting criterion type
 * Used in both accordion and edit form
 */
const CriterionTypeSelector = ({ 
  selectedType, 
  onChange, 
  namePrefix,
  disabled = false 
}) => {
  return (
    <div 
      role="radiogroup" 
      aria-label="Type de motivation clé" 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '8px' 
      }}
    >
      {Object.values(CRITERION_TYPES).map((criterionType) => {
        const isSelected = selectedType === criterionType;
        const label = CRITERION_TYPE_LABELS[criterionType];
        const color = CRITERION_TYPE_COLORS[criterionType];
        const inputId = `${namePrefix}-${criterionType}`;
        
        return (
          <label
            key={criterionType}
            htmlFor={inputId}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
              border: `2px solid ${isSelected ? color : '#ddd'}`,
              fontSize: '0.85rem',
              transition: 'all 0.2s',
              opacity: disabled ? 0.6 : 1
            }}
          >
            <input
              type="radio"
              id={inputId}
              name={namePrefix}
              value={criterionType}
              checked={isSelected}
              onChange={(e) => !disabled && onChange(e.target.value)}
              disabled={disabled}
              style={{ marginRight: '6px' }}
            />
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                backgroundColor: color,
                marginRight: '6px',
                border: '1px solid #ddd'
              }}
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

CriterionTypeSelector.propTypes = {
  selectedType: PropTypes.oneOf(Object.values(CRITERION_TYPES)).isRequired,
  onChange: PropTypes.func.isRequired,
  namePrefix: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default React.memo(CriterionTypeSelector);
