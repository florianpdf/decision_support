/**
 * Recommendation result modal component
 * Displays the recommended profession with score, explanation and calculation legend
 */

import React from 'react';
import PropTypes from 'prop-types';
import { loadProfessions } from '../../services/storage';

/**
 * Recommendation modal component
 * @param {Object} props
 * @param {Object} props.recommendation - Recommendation result object
 * @param {Function} props.onClose - Callback to close the modal
 */
function RecommendationModal({ recommendation, onClose }) {
  if (!recommendation) {
    return null;
  }

  const professions = loadProfessions();
  const recommendedProfession = professions.find(p => p.id === recommendation.recommendedProfessionId);
  const confidence = recommendation.confidence || { percentage: 0, label: 'Non fiable' };

  // Get confidence color
  const getConfidenceColor = (percentage) => {
    if (percentage >= 80) return '#1e6b47';
    if (percentage >= 60) return '#2d8659';
    if (percentage >= 40) return '#ff9800';
    return '#b84c6b';
  };

  const confidenceColor = getConfidenceColor(confidence.percentage);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f0f0f0',
            color: '#7f8c8d',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
            e.currentTarget.style.color = '#2c3e50';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.color = '#7f8c8d';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{
          padding: '30px 30px 20px 30px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🎯</span>
            <span>Recommandation</span>
          </h2>
          <p style={{
            margin: 0,
            color: '#5a6268',
            fontSize: '0.95rem'
          }}>
            Basée sur vos critères de comparaison
          </p>
        </div>

        {/* Recommended Profession */}
        <div style={{
          padding: '30px',
          backgroundColor: '#f0f4ff',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <div style={{
            marginBottom: '15px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#5568d3',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Métier recommandé
          </div>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#2c3e50'
          }}>
            {recommendedProfession?.name || 'Métier inconnu'}
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{
                fontSize: '0.85rem',
                color: '#5a6268',
                marginBottom: '5px'
              }}>
                Score total
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#5568d3'
              }}>
                {Math.round(recommendation.recommendedScore).toLocaleString('fr-FR')}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '0.85rem',
                color: '#5a6268',
                marginBottom: '5px'
              }}>
                Fiabilité
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: confidenceColor
                }}>
                  {confidence.percentage}%
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  color: confidenceColor,
                  fontWeight: '600'
                }}>
                  ({confidence.label})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        {recommendation.explanation && (
          <div style={{
            padding: '30px',
            borderBottom: '2px solid #e0e0e0'
          }}>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              💡 Explication
            </h4>
            {recommendation.explanation.points && recommendation.explanation.points.length > 0 && (
              <ul style={{
                margin: '0 0 15px 0',
                paddingLeft: '20px',
                color: '#2c3e50',
                lineHeight: '1.6'
              }}>
                {recommendation.explanation.points.map((point, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {point}
                  </li>
                ))}
              </ul>
            )}
            {recommendation.explanation.warnings && recommendation.explanation.warnings.length > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fff3e0',
                borderRadius: '8px',
                border: '1px solid #ff9800'
              }}>
                {recommendation.explanation.warnings.map((warning, index) => (
                  <p key={index} style={{
                    margin: 0,
                    color: '#e65100',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    ⚠️ {warning}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Scores */}
        {recommendation.allScores && recommendation.allScores.length > 1 && (
          <div style={{
            padding: '30px',
            borderBottom: '2px solid #e0e0e0'
          }}>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              📊 Scores de tous les métiers
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {recommendation.allScores.map((score, index) => {
                const prof = professions.find(p => p.id === score.professionId);
                const isRecommended = score.professionId === recommendation.recommendedProfessionId;
                return (
                  <div
                    key={score.professionId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: isRecommended ? '#f0f4ff' : '#f8f9fa',
                      borderRadius: '8px',
                      border: isRecommended ? '2px solid #5568d3' : '1px solid #e0e0e0'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {isRecommended && (
                        <span style={{ fontSize: '1.2rem' }}>🏆</span>
                      )}
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: isRecommended ? '700' : '500',
                        color: '#2c3e50'
                      }}>
                        {index + 1}. {prof?.name || 'Métier inconnu'}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: isRecommended ? '#5568d3' : '#5a6268'
                    }}>
                      {Math.round(score.totalScore).toLocaleString('fr-FR')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Calculation Legend */}
        <div style={{
          padding: '30px',
          backgroundColor: '#f8f9fa'
        }}>
          <h4 style={{
            margin: '0 0 15px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            📐 Légende du calcul
          </h4>
          <div style={{
            fontSize: '0.85rem',
            color: '#5a6268',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Score par intérêt professionnel :</strong> Somme des importances × Multiplicateur de type × Priorité
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Multiplicateur de type :</strong>
            </p>
            <ul style={{ margin: '0 0 10px 20px', padding: 0 }}>
              <li>1.5 si majorité d'avantages (≥50%)</li>
              <li>0.5 si majorité de désavantages (≥50%)</li>
              <li>1.0 si majorité de NSP ou équilibré</li>
            </ul>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Priorité :</strong> 0.2 (très faible) à 2.0 (très élevée), par défaut 1.0
            </p>
            <p style={{ margin: 0 }}>
              <strong>Score total :</strong> Somme de tous les scores par intérêt professionnel
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#5568d3',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4455b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5568d3';
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

RecommendationModal.propTypes = {
  recommendation: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default RecommendationModal;
