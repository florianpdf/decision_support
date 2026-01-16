import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from './ui/IconButton';
import CriterionWeightAndType from './ui/CriterionWeightAndType';
import CritereEditForm from './forms/CritereEditForm';
import { CRITERION_TYPE_LABELS, CRITERION_TYPE_COLORS, CRITERION_TYPES } from '../utils/constants';

/**
 * List of criteria for a category
 */
const CritereList = forwardRef(({ category, onUpdate, onDelete, onToggleStateChange }, ref) => {
  const [editingId, setEditingId] = useState(null);
  const [localWeight, setLocalWeight] = useState({});
  const [localType, setLocalType] = useState({});
  const [openCriteria, setOpenCriteria] = useState({});

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

  const toggleCriterion = (criterionId) => {
    setOpenCriteria(prev => ({
      ...prev,
      [criterionId]: !prev[criterionId]
    }));
  };

  const toggleAll = (open) => {
    const newState = {};
    criteria.forEach(criterion => {
      newState[criterion.id] = open;
    });
    setOpenCriteria(newState);
  };

  // Expose toggleAll function via ref
  useImperativeHandle(ref, () => ({
    toggleAll
  }));

  // Notify parent when toggle state changes
  useEffect(() => {
    if (onToggleStateChange && criteria.length > 0) {
      const allOpen = criteria.every(criterion => openCriteria[criterion.id] === true);
      onToggleStateChange(allOpen);
    } else if (onToggleStateChange && criteria.length === 0) {
      onToggleStateChange(false);
    }
  }, [openCriteria, criteria, onToggleStateChange]);

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

        const isOpen = openCriteria[criterion.id] || false;
        
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
                  categoryColor={categoryColor}
                />
              </div>
            ) : (
              <>
                <div className="critere-item-header">
                  <div
                    className="critere-item-content clickable"
                    onClick={() => toggleCriterion(criterion.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleCriterion(criterion.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    aria-label={`${criterionName}, Importance: ${displayWeight}, Type: ${CRITERION_TYPE_LABELS[displayType]}, cliquer pour ${isOpen ? 'fermer' : 'ouvrir'}`}
                  >
                    <div
                      className="critere-color"
                      style={{ backgroundColor: CRITERION_TYPE_COLORS[displayType] || CRITERION_TYPE_COLORS[CRITERION_TYPES.NEUTRAL] }}
                    />
                    <div className="critere-info">
                      <div className="critere-nom">
                        {criterionName}
                        <span className="accordion-icon">
                          {isOpen ? (
                            <ExpandMoreIcon style={{ fontSize: '1.2rem' }} />
                          ) : (
                            <ChevronRightIcon style={{ fontSize: '1.2rem' }} />
                          )}
                        </span>
                      </div>
                      { !isOpen && <div className="critere-details-summary">
                        ⚖️ Importance: {displayWeight} • 🎯 Type: {CRITERION_TYPE_LABELS[displayType]}
                      </div> }
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
                </div>
                {isOpen && (
                  <div className="critere-item-expanded">
                    <div className="critere-details">
                      <CriterionWeightAndType
                        weight={displayWeight}
                        type={displayType}
                        onWeightChange={(newValue) => {
                          handleSliderChange(criterion.id, newValue);
                        }}
                        onWeightCommit={(newValue) => {
                          handleSliderCommit(criterion.id, newValue, criterionName, displayType);
                        }}
                        onTypeChange={(newType) => {
                          handleTypeChange(criterion.id, newType, criterionName, displayWeight);
                        }}
                        categoryColor={categoryColor}
                        showWeightLabel={true}
                        showWeightValue={false}
                        namePrefix={`criterion-type-${category.id}-${criterion.id}`}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});

CritereList.displayName = 'CritereList';

CritereList.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    criteria: PropTypes.array
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStateChange: PropTypes.func
};

export default React.memo(CritereList);
