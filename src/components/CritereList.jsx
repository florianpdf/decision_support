import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import IconButton from './ui/IconButton';
import CritereEditForm from './forms/CritereEditForm';
import { getWeightColor } from '../utils/weightColors';

/**
 * List of criteria for a category
 */
const CritereList = ({ category, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [localWeight, setLocalWeight] = useState({});

  const categoryColor = category.color;
  const criteria = category.criteria || [];

  const handleSliderChange = (criterionId, newValue) => {
    setLocalWeight(prev => ({
      ...prev,
      [`${category.id}-${criterionId}`]: newValue
    }));
  };

  const handleSliderCommit = (criterionId, newValue, currentName) => {
    setLocalWeight(prev => {
      const newState = { ...prev };
      delete newState[`${category.id}-${criterionId}`];
      return newState;
    });
    onUpdate(category.id, criterionId, {
      name: currentName,
      weight: newValue
    }, true);
  };

  if (!criteria || criteria.length === 0) {
    return null;
  }

  return (
    <div className="criteres-list">
      {criteria.map((criterion) => {
        const localWeightKey = `${category.id}-${criterion.id}`;
        const displayWeight = localWeight[localWeightKey] !== undefined
          ? localWeight[localWeightKey]
          : criterion.weight;
        
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
                            handleSliderCommit(criterion.id, newValue, criterionName);
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
