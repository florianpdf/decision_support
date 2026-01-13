import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import IconButton from './ui/IconButton';
import CritereEditForm from './forms/CritereEditForm';
import { CRITERION_TYPES, CRITERION_TYPE_LABELS, CRITERION_TYPE_COLORS } from '../utils/constants';

/**
 * List of criteria for a category
 */
const CritereList = ({ category, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [localWeight, setLocalWeight] = useState({});
  const [localType, setLocalType] = useState({});

  const categoryColor = category.color;
  const criteria = category.criteria || [];

  const handleSliderChange = (criterionId, newValue) => {
    setLocalWeight(prev => ({
      ...prev,
      [`${category.id}-${criterionId}`]: newValue
    }));
  };

  const handleSliderCommit = (criterionId, newValue, currentName, currentType) => {
    setLocalWeight(prev => {
      const newState = { ...prev };
      delete newState[`${category.id}-${criterionId}`];
      return newState;
    });
    onUpdate(category.id, criterionId, {
      name: currentName,
      weight: newValue,
      type: currentType
    }, true);
  };

  const handleTypeChange = (criterionId, newType, currentName, currentWeight) => {
    setLocalType(prev => {
      const newState = { ...prev };
      delete newState[`${category.id}-${criterionId}`];
      return newState;
    });
    onUpdate(category.id, criterionId, {
      name: currentName,
      weight: currentWeight,
      type: newType
    }, true);
  };

  if (!criteria || criteria.length === 0) {
    return null;
  }

  return (
    <div className="criteres-list">
      {criteria.map((criterion) => {
        const localWeightKey = `${category.id}-${criterion.id}`;
        const localTypeKey = `${category.id}-${criterion.id}`;
        const displayWeight = localWeight[localWeightKey] !== undefined
          ? localWeight[localWeightKey]
          : criterion.weight;
        const displayType = localType[localTypeKey] !== undefined
          ? localType[localTypeKey]
          : (criterion.type || 'neutral');
        
        const criterionName = criterion.name;

        return (
          <div
            key={criterion.id}
            className={`critere-item ${editingId === criterion.id ? 'editing' : ''}`}
          >
            {editingId === criterion.id ? (
              <div className="critere-edit-container">
                <CritereEditForm
                  critere={criterion}
                  onSubmit={(updatedCriterion) => {
                    onUpdate(category.id, criterion.id, updatedCriterion);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <>
                <div className="critere-item-content">
                  <div
                    className="critere-color"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <div className="critere-info">
                    <div className="critere-nom">{criterionName}</div>
                    <div className="critere-details">
                      <div className="critere-weight-label">
                        ⚖️ Importance: {displayWeight}
                      </div>
                      <div className="critere-slider-container">
                        <Slider
                          value={displayWeight}
                          onChange={(e, newValue) => {
                            handleSliderChange(criterion.id, newValue);
                          }}
                          onChangeCommitted={(e, newValue) => {
                            handleSliderCommit(criterion.id, newValue, criterionName, displayType);
                          }}
                          min={1}
                          max={30}
                          step={1}
                          valueLabelDisplay="auto"
                          aria-label="Importance de la motivation clé"
                          marks
                          sx={{
                            '& .MuiSlider-thumb': {
                              color: categoryColor
                            },
                            '& .MuiSlider-track': {
                              color: categoryColor
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
                      <div className="critere-type-container" style={{ marginTop: '15px' }}>
                        <div className="critere-type-label" style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                          🎯 Type:
                        </div>
                        <div role="radiogroup" aria-label="Type de motivation clé" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {Object.values(CRITERION_TYPES).map((criterionType) => {
                            const isSelected = displayType === criterionType;
                            const label = CRITERION_TYPE_LABELS[criterionType];
                            const color = CRITERION_TYPE_COLORS[criterionType];
                            const inputId = `criterion-type-${category.id}-${criterion.id}-${criterionType}`;
                            
                            return (
                              <label
                                key={criterionType}
                                htmlFor={inputId}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
                                  border: `2px solid ${isSelected ? color : '#ddd'}`,
                                  fontSize: '0.85rem',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <input
                                  type="radio"
                                  id={inputId}
                                  name={`criterion-type-${category.id}-${criterion.id}`}
                                  value={criterionType}
                                  checked={isSelected}
                                  onChange={(e) => {
                                    handleTypeChange(criterion.id, e.target.value, criterionName, displayWeight);
                                  }}
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="critere-actions">
                  <IconButton
                    icon="✏️"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(criterion.id);
                    }}
                    tooltip="Modifier la motivation clé"
                    ariaLabel={`Modifier la motivation clé ${criterionName}`}
                    style={{ color: categoryColor }}
                    className="btn-icon-category"
                  />
                  <IconButton
                    icon="🗑️"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category.id, criterion.id);
                    }}
                    tooltip="Supprimer la motivation clé"
                    ariaLabel={`Supprimer la motivation clé ${criterionName}`}
                    style={{ color: categoryColor }}
                    className="btn-icon-category"
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

CritereList.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    criteria: PropTypes.array
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default React.memo(CritereList);
