/**
 * Recommendation configuration component
 * Allows users to configure recommendation criteria preferences
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import { DEFAULT_PREFERENCES } from '../../services/recommendationService';
import { loadCategories } from '../../services/storage';

/**
 * Recommendation configuration component
 * @param {Object} props
 * @param {Object} props.preferences - Current preferences object
 * @param {Function} props.onPreferencesChange - Callback when preferences change
 * @param {Array} props.professionIds - Array of profession IDs to get categories from
 */
function RecommendationConfig({ preferences, onPreferencesChange, professionIds = [] }) {
  const [localPreferences, setLocalPreferences] = useState({
    advantageWeight: DEFAULT_PREFERENCES.advantageWeight,
    disadvantageWeight: DEFAULT_PREFERENCES.disadvantageWeight,
    priorityCategories: {}
  });
  const [categories, setCategories] = useState([]);

  // Load categories from all selected professions
  useEffect(() => {
    if (professionIds.length > 0) {
      const allCategories = [];
      professionIds.forEach(professionId => {
        const profCategories = loadCategories(professionId);
        profCategories.forEach(cat => {
          // Avoid duplicates
          if (!allCategories.find(c => c.id === cat.id)) {
            allCategories.push(cat);
          }
        });
      });
      setCategories(allCategories);
    }
  }, [professionIds]);

  // Initialize with provided preferences
  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        advantageWeight: preferences.advantageWeight ?? DEFAULT_PREFERENCES.advantageWeight,
        disadvantageWeight: preferences.disadvantageWeight ?? DEFAULT_PREFERENCES.disadvantageWeight,
        priorityCategories: preferences.priorityCategories ?? {}
      });
    }
  }, [preferences]);

  const handleAdvantageWeightChange = (value) => {
    const newPreferences = {
      ...localPreferences,
      advantageWeight: value / 100, // Convert percentage to decimal
      disadvantageWeight: (100 - value) / 100 // Auto-adjust disadvantage
    };
    setLocalPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const handleDisadvantageWeightChange = (value) => {
    const newPreferences = {
      ...localPreferences,
      disadvantageWeight: value / 100, // Convert percentage to decimal
      advantageWeight: (100 - value) / 100 // Auto-adjust advantage
    };
    setLocalPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const handleCategoryPriorityChange = (categoryId, priority) => {
    const newPriorityCategories = {
      ...localPreferences.priorityCategories,
      [categoryId]: priority
    };
    // Remove if priority is 3 (default)
    if (priority === 3) {
      delete newPriorityCategories[categoryId];
    }
    const newPreferences = {
      ...localPreferences,
      priorityCategories: newPriorityCategories
    };
    setLocalPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const handleReset = () => {
    const defaultPrefs = {
      advantageWeight: DEFAULT_PREFERENCES.advantageWeight,
      disadvantageWeight: DEFAULT_PREFERENCES.disadvantageWeight,
      priorityCategories: {}
    };
    setLocalPreferences(defaultPrefs);
    onPreferencesChange(defaultPrefs);
  };

  const advantagePercent = Math.round(localPreferences.advantageWeight * 100);
  const disadvantagePercent = Math.round(localPreferences.disadvantageWeight * 100);

  return (
    <div style={{ padding: '30px' }}>

      {/* Advantage/Disadvantage Weights */}
      <div style={{ marginBottom: '30px', marginTop: '10px' }}>
        <div style={{ 
          marginBottom: '25px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '1rem', 
            fontWeight: '700', 
            color: '#2c3e50' 
          }}>
            ⚖️ Équilibre avantages / désavantages
          </h4>
          <p style={{ 
            margin: '0 0 15px 0', 
            fontSize: '0.9rem', 
            color: '#5a6268',
            lineHeight: '1.6'
          }}>
            Ces paramètres déterminent l'importance relative des avantages et des désavantages dans le calcul du score de recommandation. 
            Les deux poids sont complémentaires : si vous augmentez l'un, l'autre diminue automatiquement.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <label style={{ 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              color: '#2c3e50' 
            }}>
              Poids des avantages
            </label>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: '700', 
              color: '#5568d3',
              padding: '4px 12px',
              backgroundColor: '#f0f4ff',
              borderRadius: '6px'
            }}>
              {advantagePercent}%
            </span>
          </div>
          <Slider
            value={advantagePercent}
            onChange={(e, newValue) => handleAdvantageWeightChange(newValue)}
            min={0}
            max={100}
            step={5}
            valueLabelDisplay="auto"
            aria-label="Poids des avantages"
            sx={{
              '& .MuiSlider-thumb': {
                color: '#2d8659'
              },
              '& .MuiSlider-track': {
                color: '#2d8659'
              }
            }}
          />
          <div style={{ 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#e8f5e9',
            borderRadius: '6px',
            border: '1px solid #c8e6c9'
          }}>
            <p style={{ 
              margin: '0 0 5px 0', 
              fontSize: '0.85rem', 
              color: '#2c3e50',
              fontWeight: '600'
            }}>
              💡 Comment ça fonctionne ?
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.85rem', 
              color: '#5a6268',
              lineHeight: '1.5'
            }}>
              Plus ce poids est élevé, plus les métiers ayant de nombreuses motivations de type "Avantage" verront leur score augmenter. 
              <strong> Exemple :</strong> Avec un poids de 80%, un métier avec 10 avantages aura un meilleur score qu'un métier avec seulement 3 avantages, même si leurs autres caractéristiques sont similaires.
            </p>
          </div>
        </div>

        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <label style={{ 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              color: '#2c3e50' 
            }}>
              Poids des désavantages
            </label>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: '700', 
              color: '#b84c6b',
              padding: '4px 12px',
              backgroundColor: '#fce4ec',
              borderRadius: '6px'
            }}>
              {disadvantagePercent}%
            </span>
          </div>
          <Slider
            value={disadvantagePercent}
            onChange={(e, newValue) => handleDisadvantageWeightChange(newValue)}
            min={0}
            max={100}
            step={5}
            valueLabelDisplay="auto"
            aria-label="Poids des désavantages"
            sx={{
              '& .MuiSlider-thumb': {
                color: '#b84c6b'
              },
              '& .MuiSlider-track': {
                color: '#b84c6b'
              }
            }}
          />
          <div style={{ 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#fce4ec',
            borderRadius: '6px',
            border: '1px solid #f8bbd0'
          }}>
            <p style={{ 
              margin: '0 0 5px 0', 
              fontSize: '0.85rem', 
              color: '#2c3e50',
              fontWeight: '600'
            }}>
              💡 Comment ça fonctionne ?
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.85rem', 
              color: '#5a6268',
              lineHeight: '1.5'
            }}>
              Plus ce poids est élevé, plus les métiers ayant de nombreuses motivations de type "Désavantage" verront leur score diminuer. 
              <strong> Exemple :</strong> Avec un poids de 80%, un métier avec 8 désavantages sera fortement pénalisé par rapport à un métier avec seulement 2 désavantages, même si leurs avantages sont comparables.
            </p>
          </div>
        </div>
      </div>

      {/* Category Priorities */}
      {categories.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '1rem', 
              fontWeight: '700', 
              color: '#2c3e50' 
            }}>
              🎯 Priorités par intérêt professionnel (optionnel)
            </h4>
            <p style={{ 
              margin: '0 0 10px 0', 
              fontSize: '0.9rem', 
              color: '#5a6268',
              lineHeight: '1.6'
            }}>
              Vous pouvez attribuer une priorité différente à chaque intérêt professionnel pour influencer le calcul de recommandation. 
              Les intérêts avec une priorité élevée auront plus de poids dans le score final.
            </p>
            <div style={{
              padding: '10px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              marginTop: '10px'
            }}>
              <p style={{ 
                margin: '0 0 8px 0', 
                fontSize: '0.85rem', 
                color: '#2c3e50',
                fontWeight: '600'
              }}>
                📊 Échelle de priorité :
              </p>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '20px',
                fontSize: '0.85rem',
                color: '#5a6268',
                lineHeight: '1.8'
              }}>
                <li><strong>Priorité 1 (Très faible) :</strong> L'intérêt professionnel compte peu dans le calcul</li>
                <li><strong>Priorité 2 (Faible) :</strong> L'intérêt professionnel a un poids réduit</li>
                <li><strong>Priorité 3 (Normale) :</strong> Poids standard (valeur par défaut)</li>
                <li><strong>Priorité 4 (Élevée) :</strong> L'intérêt professionnel a un poids important</li>
                <li><strong>Priorité 5 (Très élevée) :</strong> L'intérêt professionnel est prioritaire dans le calcul</li>
              </ul>
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '0.85rem', 
                color: '#5a6268',
                fontStyle: 'italic'
              }}>
                💡 <strong>Astuce :</strong> Si certains intérêts professionnels sont plus importants pour vous, augmentez leur priorité. 
                Les métiers qui excellent dans ces intérêts prioritaires seront favorisés dans la recommandation.
              </p>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            {categories.map(category => {
              const currentPriority = localPreferences.priorityCategories[category.id] || 3;
              return (
                <div 
                  key={category.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: category.color,
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '600', 
                      color: '#2c3e50',
                      marginBottom: '4px'
                    }}>
                      {category.name}
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    flexShrink: 0
                  }}>
                    {[1, 2, 3, 4, 5].map(priority => (
                      <button
                        key={priority}
                        onClick={() => handleCategoryPriorityChange(category.id, priority)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: `2px solid ${currentPriority === priority ? '#5568d3' : '#e0e0e0'}`,
                          backgroundColor: currentPriority === priority ? '#f0f4ff' : '#ffffff',
                          color: currentPriority === priority ? '#5568d3' : '#7f8c8d',
                          fontWeight: currentPriority === priority ? '700' : '400',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (currentPriority !== priority) {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.borderColor = '#5568d3';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPriority !== priority) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                          }
                        }}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0',
        marginTop: '20px'
      }}>
        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#7f8c8d',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e9ecef';
            e.currentTarget.style.borderColor = '#d0d0d0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        >
          🔄 Réinitialiser aux valeurs par défaut
        </button>
      </div>
    </div>
  );
}

RecommendationConfig.propTypes = {
  preferences: PropTypes.object,
  onPreferencesChange: PropTypes.func.isRequired,
  professionIds: PropTypes.arrayOf(PropTypes.number)
};

export default RecommendationConfig;
