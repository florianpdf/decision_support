import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';

/**
 * Reusable weight slider component for criterion importance
 * Used in accordion, edit form, and create form
 */
const WeightSlider = ({ 
  value, 
  onChange, 
  onChangeCommitted,
  min = 1,
  max = 30,
  color = '#5568d3',
  disabled = false,
  showValue = true,
  id,
  ariaLabel = 'Importance de la motivation clé'
}) => {
  return (
    <div>
      <div className="critere-slider-container">
        <Slider
          id={id}
          value={value}
          onChange={(e, newValue) => onChange(newValue)}
          onChangeCommitted={onChangeCommitted ? (e, newValue) => onChangeCommitted(newValue) : undefined}
          min={min}
          max={max}
          step={1}
          valueLabelDisplay="auto"
          aria-label={ariaLabel}
          marks
          disabled={disabled}
          sx={{
            '& .MuiSlider-thumb': {
              color: color
            },
            '& .MuiSlider-track': {
              color: color
            },
            '& .MuiSlider-rail': {
              color: '#e0e0e0'
            },
            '& .MuiSlider-markLabel': {
              fontSize: '0.7rem'
            }
          }}
        />
      </div>
      {showValue && (
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
          Importance sélectionnée : {value}
        </div>
      )}
    </div>
  );
};

WeightSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeCommitted: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  showValue: PropTypes.bool,
  id: PropTypes.string,
  ariaLabel: PropTypes.string
};

export default React.memo(WeightSlider);
