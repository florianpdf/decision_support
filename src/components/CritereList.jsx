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
  const [localPoids, setLocalPoids] = useState({});

  const handleSliderChange = (critereId, newValue) => {
    setLocalPoids(prev => ({
      ...prev,
      [`${category.id}-${critereId}`]: newValue
    }));
  };

  const handleSliderCommit = (critereId, newValue, currentNom) => {
    setLocalPoids(prev => {
      const newState = { ...prev };
      delete newState[`${category.id}-${critereId}`];
      return newState;
    });
    onUpdate(category.id, critereId, {
      nom: currentNom,
      poids: newValue
    }, true);
  };

  if (!category.criteres || category.criteres.length === 0) {
    return null;
  }

  return (
    <div className="criteres-list">
      {category.criteres.map((critere) => {
        const localPoidsKey = `${category.id}-${critere.id}`;
        const displayPoids = localPoids[localPoidsKey] !== undefined
          ? localPoids[localPoidsKey]
          : critere.poids;

        return (
          <div
            key={critere.id}
            className={`critere-item ${editingId === critere.id ? 'editing' : ''}`}
          >
            {editingId === critere.id ? (
              <div className="critere-edit-container">
                <CritereEditForm
                  critere={critere}
                  onSubmit={(updatedCritere) => {
                    onUpdate(category.id, critere.id, updatedCritere);
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
                    style={{ backgroundColor: category.couleur }}
                  />
                  <div className="critere-info">
                    <div className="critere-nom">{critere.nom}</div>
                    <div className="critere-details">
                      <div className="critere-weight-label">
                        ⚖️ Importance: {displayPoids}
                      </div>
                      <div className="critere-slider-container">
                        <Slider
                          value={displayPoids}
                          onChange={(e, newValue) => {
                            handleSliderChange(critere.id, newValue);
                          }}
                          onChangeCommitted={(e, newValue) => {
                            handleSliderCommit(critere.id, newValue, critere.nom);
                          }}
                          min={1}
                          max={30}
                          step={1}
                          valueLabelDisplay="auto"
                          aria-label="Importance de la motivation clé"
                          marks
                          sx={{
                            '& .MuiSlider-thumb': {
                              color: category.couleur
                            },
                            '& .MuiSlider-track': {
                              color: category.couleur
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
                      setEditingId(critere.id);
                    }}
                    tooltip="Modifier la motivation clé"
                    ariaLabel={`Modifier la motivation clé ${critere.nom}`}
                    style={{ color: category.couleur }}
                    className="btn-icon-category"
                  />
                  <IconButton
                    icon="🗑️"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category.id, critere.id);
                    }}
                    tooltip="Supprimer la motivation clé"
                    ariaLabel={`Supprimer la motivation clé ${critere.nom}`}
                    style={{ color: category.couleur }}
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
    couleur: PropTypes.string.isRequired,
    criteres: PropTypes.array
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default React.memo(CritereList);
