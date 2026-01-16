/**
 * Detailed comparison view component
 * Shows category breakdown and complete criteria list for each profession
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getCategoriesForProfession } from '../../services/storage';
import { CRITERION_TYPES } from '../../utils/constants';
import Card from '../ui/Card';

/**
 * Get type label in French
 */
const getTypeLabel = (type) => {
  const labels = {
    [CRITERION_TYPES.ADVANTAGE]: 'Avantage',
    [CRITERION_TYPES.SMALL_ADVANTAGE]: 'Petit avantage',
    [CRITERION_TYPES.NEUTRAL]: 'Neutre',
    [CRITERION_TYPES.SMALL_DISADVANTAGE]: 'Petit désavantage',
    [CRITERION_TYPES.DISADVANTAGE]: 'Désavantage'
  };
  return labels[type] || 'Neutre';
};

/**
 * Get type color
 */
const getTypeColor = (type) => {
  const colors = {
    [CRITERION_TYPES.ADVANTAGE]: '#2d8659',
    [CRITERION_TYPES.SMALL_ADVANTAGE]: '#5cb85c',
    [CRITERION_TYPES.NEUTRAL]: '#7f8c8d',
    [CRITERION_TYPES.SMALL_DISADVANTAGE]: '#f0ad4e',
    [CRITERION_TYPES.DISADVANTAGE]: '#b84c6b'
  };
  return colors[type] || '#7f8c8d';
};

/**
 * Comparison detail view component
 * @param {Object} props
 * @param {Array} props.professionIds - Array of selected profession IDs
 * @param {Array} props.professions - Array of profession objects
 */
function ComparisonDetailView({ professionIds, professions }) {
  const [compareMode, setCompareMode] = useState(false);

  if (!professionIds || professionIds.length === 0) {
    return (
      <Card>
        <p style={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center' }}>
          Aucun métier sélectionné
        </p>
      </Card>
    );
  }

  // Get all categories and criteria for all selected professions
  const professionsData = useMemo(() => {
    return professionIds.map(professionId => {
      const profession = professions.find(p => p.id === professionId);
      if (!profession) return null;

      const categories = getCategoriesForProfession(professionId);
      const categoriesWithCriteria = categories.filter(cat => 
        cat.criteria && cat.criteria.length > 0
      );

      return {
        id: professionId,
        name: profession.name,
        categories: categoriesWithCriteria
      };
    }).filter(Boolean);
  }, [professionIds, professions]);

  // Get all unique categories across all professions
  const allCategories = useMemo(() => {
    const categoryMap = new Map();
    professionsData.forEach(profData => {
      profData.categories.forEach(cat => {
        if (!categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            color: cat.color
          });
        }
      });
    });
    return Array.from(categoryMap.values());
  }, [professionsData]);

  // Get all unique criteria across all professions
  const allCriteria = useMemo(() => {
    const criterionMap = new Map();
    professionsData.forEach(profData => {
      profData.categories.forEach(cat => {
        cat.criteria.forEach(criterion => {
          const key = `${cat.id}-${criterion.id}`;
          if (!criterionMap.has(key)) {
            criterionMap.set(key, {
              id: criterion.id,
              name: criterion.name,
              categoryId: cat.id,
              categoryName: cat.name,
              categoryColor: cat.color
            });
          }
        });
      });
    });
    return Array.from(criterionMap.values());
  }, [professionsData]);

  // Render comparison table view
  const renderComparisonTable = () => {
    return (
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#2c3e50',
                  fontSize: '0.95rem',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#f8f9fa',
                  zIndex: 10
                }}>
                  Intérêt / Motivation
                </th>
                {professionsData.map(prof => (
                  <th
                    key={prof.id}
                    style={{
                      padding: '15px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#2c3e50',
                      fontSize: '0.95rem',
                      minWidth: '180px'
                    }}
                  >
                    {prof.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCategories.map(category => {
                const categoryCriteria = allCriteria.filter(c => c.categoryId === category.id);
                
                return (
                  <React.Fragment key={category.id}>
                    {/* Category Row */}
                    <tr style={{ backgroundColor: '#f0f4ff', borderTop: '2px solid #e0e0e0' }}>
                      <td
                        style={{
                          padding: '12px 15px',
                          fontWeight: '700',
                          color: '#2c3e50',
                          fontSize: '0.95rem',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: '#f0f4ff',
                          zIndex: 9
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              backgroundColor: category.color,
                              flexShrink: 0
                            }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </td>
                      {professionsData.map(prof => {
                        const profCategory = prof.categories.find(c => c.id === category.id);
                        const hasCategory = !!profCategory;
                        const categoryWeight = profCategory
                          ? profCategory.criteria.reduce((sum, c) => sum + (c.weight || 15), 0)
                          : 0;
                        const criteriaCount = profCategory ? profCategory.criteria.length : 0;

                        return (
                          <td
                            key={prof.id}
                            style={{
                              padding: '12px 15px',
                              textAlign: 'center',
                              backgroundColor: hasCategory ? '#ffffff' : '#f8f9fa',
                              color: hasCategory ? '#2c3e50' : '#cccccc'
                            }}
                          >
                            {hasCategory ? (
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '8px',
                                alignItems: 'center'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 10px',
                                  backgroundColor: '#f0f4ff',
                                  borderRadius: '6px',
                                  border: '1px solid #e0e0e0'
                                }}>
                                  <span style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>📊</span>
                                  <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#2c3e50' }}>
                                    {criteriaCount} motivation{criteriaCount > 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 10px',
                                  backgroundColor: '#e8f5e9',
                                  borderRadius: '6px',
                                  border: '1px solid #c8e6c9'
                                }}>
                                  <span style={{ fontSize: '0.85rem', color: '#2e7d32' }}>⚖️</span>
                                  <span style={{ fontSize: '0.9rem', color: '#2e7d32', fontWeight: '700' }}>
                                    {categoryWeight}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: '#5a6268' }}>pts</span>
                                </div>
                              </div>
                            ) : (
                              <span style={{ 
                                fontStyle: 'italic', 
                                color: '#cccccc',
                                fontSize: '0.9rem'
                              }}>-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Criteria Rows */}
                    {categoryCriteria.map(criterion => (
                      <tr key={`${category.id}-${criterion.id}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td
                          style={{
                            padding: '10px 15px 10px 40px',
                            fontSize: '0.9rem',
                            color: '#5a6268',
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#ffffff',
                            zIndex: 8
                          }}
                        >
                          {criterion.name}
                        </td>
                        {professionsData.map(prof => {
                          const profCategory = prof.categories.find(c => c.id === category.id);
                          const profCriterion = profCategory?.criteria.find(c => c.id === criterion.id);
                          const hasCriterion = !!profCriterion;

                          return (
                            <td
                              key={prof.id}
                              style={{
                                padding: '10px 15px',
                                textAlign: 'center',
                                backgroundColor: hasCriterion ? '#ffffff' : '#f8f9fa'
                              }}
                            >
                              {hasCriterion ? (
                                <div style={{ 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  gap: '8px', 
                                  alignItems: 'center',
                                  padding: '8px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '8px',
                                  border: `2px solid ${getTypeColor(profCriterion.type || CRITERION_TYPES.NEUTRAL)}`
                                }}>
                                  <div style={{
                                    padding: '4px 10px',
                                    backgroundColor: getTypeColor(profCriterion.type || CRITERION_TYPES.NEUTRAL),
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {getTypeLabel(profCriterion.type || CRITERION_TYPES.NEUTRAL)}
                                  </div>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '4px'
                                  }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#5568d3' }}>
                                      {profCriterion.weight || 15}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>pts</span>
                                  </div>
                                </div>
                              ) : (
                                <span style={{ 
                                  color: '#cccccc', 
                                  fontStyle: 'italic',
                                  fontSize: '0.9rem'
                                }}>-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  // Render individual view
  const renderIndividualView = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {professionIds.map(professionId => {
        const profession = professions.find(p => p.id === professionId);
        if (!profession) return null;

        const categories = getCategoriesForProfession(professionId);
        const categoriesWithCriteria = categories.filter(cat => 
          cat.criteria && cat.criteria.length > 0
        );

        return (
          <Card
            key={professionId}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: '#5568d3',
                    flexShrink: 0
                  }}
                />
                <span>{profession.name}</span>
              </div>
            }
          >
            {categoriesWithCriteria.length === 0 ? (
              <p style={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center' }}>
                Aucun intérêt professionnel avec des motivations clés
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {categoriesWithCriteria.map(category => {
                  const categoryWeight = category.criteria.reduce(
                    (sum, criterion) => sum + (criterion.weight || 15),
                    0
                  );

                  return (
                    <div
                      key={category.id}
                      style={{
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      {/* Category Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '15px',
                        paddingBottom: '15px',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              backgroundColor: category.color,
                              flexShrink: 0
                            }}
                          />
                          <h3 style={{
                            margin: 0,
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            color: '#2c3e50'
                          }}>
                            {category.name}
                          </h3>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px'
                        }}>
                          <div style={{
                            padding: '6px 12px',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            fontSize: '0.9rem',
                            color: '#2c3e50',
                            fontWeight: '600'
                          }}>
                            {category.criteria.length} motivation{category.criteria.length > 1 ? 's' : ''}
                          </div>
                          <div style={{
                            padding: '6px 12px',
                            backgroundColor: '#f0f4ff',
                            borderRadius: '6px',
                            border: '1px solid #5568d3',
                            fontSize: '0.9rem',
                            color: '#5568d3',
                            fontWeight: '700'
                          }}>
                            Total: {categoryWeight}
                          </div>
                        </div>
                      </div>

                      {/* Criteria List */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '12px'
                      }}>
                        {category.criteria.map(criterion => (
                          <div
                            key={criterion.id}
                            style={{
                              padding: '12px',
                              backgroundColor: '#ffffff',
                              borderRadius: '8px',
                              border: `2px solid ${getTypeColor(criterion.type || CRITERION_TYPES.NEUTRAL)}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: '10px'
                            }}>
                              <span style={{
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                color: '#2c3e50',
                                flex: 1
                              }}>
                                {criterion.name}
                              </span>
                              <div style={{
                                padding: '4px 8px',
                                backgroundColor: getTypeColor(criterion.type || CRITERION_TYPES.NEUTRAL),
                                color: '#ffffff',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                              }}>
                                {getTypeLabel(criterion.type || CRITERION_TYPES.NEUTRAL)}
                              </div>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              paddingTop: '8px',
                              borderTop: '1px solid #e0e0e0'
                            }}>
                              <span style={{
                                fontSize: '0.85rem',
                                color: '#7f8c8d'
                              }}>
                                Importance:
                              </span>
                              <span style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                color: '#5568d3'
                              }}>
                                {criterion.weight || 15}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
      </div>
    );
  };

  return (
    <div>
      {/* Mode selection buttons */}
      <div style={{
        marginBottom: '25px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
      }}>
        <button
          onClick={() => setCompareMode(false)}
          style={{
            padding: '20px',
            backgroundColor: compareMode ? '#ffffff' : '#f0f4ff',
            borderRadius: '12px',
            border: compareMode ? '2px solid #e0e0e0' : '2px solid #5568d3',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'left',
            boxShadow: compareMode ? '0 2px 4px rgba(0, 0, 0, 0.05)' : '0 4px 12px rgba(85, 104, 211, 0.15)'
          }}
          onMouseEnter={(e) => {
            if (compareMode) {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.borderColor = '#5568d3';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(85, 104, 211, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (compareMode) {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📋</span>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: '#2c3e50' }}>
              Vue individuelle
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#5a6268',
            lineHeight: '1.6'
          }}>
            Affiche chaque métier dans une carte séparée avec tous ses intérêts professionnels et motivations clés détaillés.
          </p>
        </button>
        
        <button
          onClick={() => setCompareMode(true)}
          style={{
            padding: '20px',
            backgroundColor: compareMode ? '#f0f4ff' : '#ffffff',
            borderRadius: '12px',
            border: compareMode ? '2px solid #5568d3' : '2px solid #e0e0e0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'left',
            boxShadow: compareMode ? '0 4px 12px rgba(85, 104, 211, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            if (!compareMode) {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.borderColor = '#5568d3';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(85, 104, 211, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!compareMode) {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <span style={{ fontWeight: '700', fontSize: '1rem', color: '#2c3e50' }}>
              Vue comparée
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#5a6268',
            lineHeight: '1.6'
          }}>
            Compare tous les métiers côte à côte dans un tableau pour identifier rapidement les différences et similitudes.
          </p>
        </button>
      </div>

      {compareMode ? renderComparisonTable() : renderIndividualView()}
    </div>
  );
}

ComparisonDetailView.propTypes = {
  professionIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  professions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
};

export default ComparisonDetailView;
