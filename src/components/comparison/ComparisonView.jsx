/**
 * Comparison view component
 * Allows comparing up to 3 professions side by side
 */

import React, { useState, useEffect, useMemo } from 'react';
import { loadProfessions, loadRecommendationPreferences, saveRecommendationPreferences } from '../../services/storage';
import { calculateProfessionsMetrics } from '../../utils/comparisonUtils';
import { getRecommendation, DEFAULT_PREFERENCES } from '../../services/recommendationService';
import Card from '../ui/Card';
import Message from '../ui/Message';
import ComparisonMetricsTable from './ComparisonMetricsTable';
import ComparisonBarChart from './ComparisonBarChart';
import ComparisonDetailView from './ComparisonDetailView';
import RecommendationConfigModal from '../modals/RecommendationConfigModal';
import RecommendationModal from './RecommendationModal';
import ComparisonOnboarding, { isComparisonOnboardingCompleted, markComparisonOnboardingCompleted } from './ComparisonOnboarding';

/**
 * Comparison view component
 */
function ComparisonView() {
  const [selectedProfessionIds, setSelectedProfessionIds] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [activeTab, setActiveTab] = useState('global'); // 'global' or 'detailed'
  const [showRecommendationConfig, setShowRecommendationConfig] = useState(false);
  const [recommendationPreferences, setRecommendationPreferences] = useState(DEFAULT_PREFERENCES);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [runComparisonOnboarding, setRunComparisonOnboarding] = useState(false);

  // Load professions and preferences on mount
  useEffect(() => {
    const loaded = loadProfessions();
    setProfessions(loaded);
    
    // By default, select all professions (up to 3)
    if (loaded.length >= 2) {
      const defaultSelection = loaded.slice(0, 3).map(p => p.id);
      setSelectedProfessionIds(defaultSelection);
    }

    // Load saved preferences
    const savedPreferences = loadRecommendationPreferences();
    if (savedPreferences) {
      setRecommendationPreferences(savedPreferences);
    }

    // Start comparison onboarding if not completed
    if (!isComparisonOnboardingCompleted()) {
      setTimeout(() => {
        setRunComparisonOnboarding(true);
      }, 500);
    }
  }, []);

  // Restart onboarding when component remounts (triggered by key change from App.jsx)
  useEffect(() => {
    if (!isComparisonOnboardingCompleted()) {
      setTimeout(() => {
        setRunComparisonOnboarding(true);
      }, 100);
    }
  }, []);

  // Save preferences when they change
  const handlePreferencesChange = (newPreferences) => {
    setRecommendationPreferences(newPreferences);
    saveRecommendationPreferences(newPreferences);
  };

  // Handle profession selection
  const handleProfessionToggle = (professionId) => {
    setSelectedProfessionIds(prev => {
      if (prev.includes(professionId)) {
        // Deselect
        return prev.filter(id => id !== professionId);
      } else {
        // Select (max 3)
        if (prev.length >= 3) {
          return prev; // Already at max
        }
        return [...prev, professionId];
      }
    });
  };

  // Check if we have enough professions
  const hasEnoughProfessions = professions.length >= 2;
  const hasSelection = selectedProfessionIds.length >= 2;

  // Calculate metrics for selected professions
  const metricsByProfession = useMemo(() => {
    if (!hasSelection || selectedProfessionIds.length === 0) {
      return {};
    }
    return calculateProfessionsMetrics(selectedProfessionIds);
  }, [selectedProfessionIds, hasSelection]);

  // Handle recommendation request
  const handleGetRecommendation = () => {
    if (selectedProfessionIds.length < 2) {
      return;
    }
    const recommendation = getRecommendation(selectedProfessionIds, recommendationPreferences);
    setRecommendationResult(recommendation);
    setShowRecommendationModal(true);
  };

  return (
    <div className="comparison-view" style={{ padding: '20px 0' }}>
      {/* Comparison Onboarding */}
      <ComparisonOnboarding
        run={runComparisonOnboarding}
        onComplete={() => {
          setRunComparisonOnboarding(false);
          markComparisonOnboardingCompleted();
        }}
        hasSelection={hasSelection}
      />
      <div style={{ 
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '2rem', 
          fontWeight: '700',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '2.2rem' }}>📊</span>
          Comparaison des métiers
        </h1>
      </div>

      {!hasEnoughProfessions ? (
        <Card>
          <Message type="error">
            <strong>Comparaison impossible</strong>
            <p style={{ marginTop: '10px', marginBottom: 0 }}>
              Vous devez avoir au moins 2 métiers pour pouvoir les comparer.
              Créez un autre métier pour accéder à la comparaison.
            </p>
          </Message>
        </Card>
      ) : (
        <>
          {/* Selection and buttons in a flex layout */}
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <Card style={{ flex: 1, minWidth: '300px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: '#2c3e50'
                }}>
                  Sélection des métiers
                </h2>
              </div>
              <p style={{ 
                marginBottom: '15px', 
                color: '#5a6268',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                Sélectionnez jusqu'à <strong>3 métiers</strong> à comparer (minimum 2 requis) :
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {professions.map(profession => {
                  const isSelected = selectedProfessionIds.includes(profession.id);
                  const isDisabled = !isSelected && selectedProfessionIds.length >= 3;

                  return (
                    <label
                      key={profession.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px',
                        border: `2px solid ${isSelected ? '#5568d3' : '#e0e0e0'}`,
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#f0f4ff' : '#ffffff',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleProfessionToggle(profession.id)}
                        disabled={isDisabled}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer'
                        }}
                      />
                      <span style={{ fontWeight: isSelected ? '600' : '400', fontSize: '0.95rem' }}>
                        {profession.name}
                      </span>
                      {isDisabled && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#7f8c8d' }}>
                          (Max 3)
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              {selectedProfessionIds.length > 0 && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px 12px', 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: '6px',
                  border: '1px solid #c8e6c9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '1rem' }}>✓</span>
                  <span style={{ color: '#2e7d32', fontWeight: '600', fontSize: '0.9rem' }}>
                    <strong>{selectedProfessionIds.length}</strong> métier{selectedProfessionIds.length > 1 ? 's' : ''} sélectionné{selectedProfessionIds.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </Card>
          </div>

          {hasSelection ? (
            <>
              {/* Tabs */}
              <Card style={{ marginTop: '20px' }}>
                <div 
                  className="comparison-tabs"
                  style={{ 
                    display: 'flex', 
                    gap: '5px', 
                    borderBottom: '2px solid #e0e0e0',
                    marginBottom: '25px',
                    paddingBottom: '5px'
                  }}
                >
                  <button
                    onClick={() => setActiveTab('global')}
                    style={{
                      padding: '14px 28px',
                      border: 'none',
                      backgroundColor: activeTab === 'global' ? '#f0f4ff' : 'transparent',
                      color: activeTab === 'global' ? '#5568d3' : '#7f8c8d',
                      fontWeight: activeTab === 'global' ? '700' : '500',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      borderBottom: activeTab === 'global' ? '3px solid #5568d3' : '3px solid transparent',
                      marginBottom: '-5px',
                      transition: 'all 0.2s ease',
                      borderRadius: '8px 8px 0 0'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'global') {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'global') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    📊 Vue globale
                  </button>
                  <button
                    onClick={() => setActiveTab('detailed')}
                    aria-label="Vue détaillée"
                    style={{
                      padding: '14px 28px',
                      border: 'none',
                      backgroundColor: activeTab === 'detailed' ? '#f0f4ff' : 'transparent',
                      color: activeTab === 'detailed' ? '#5568d3' : '#7f8c8d',
                      fontWeight: activeTab === 'detailed' ? '700' : '500',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      borderBottom: activeTab === 'detailed' ? '3px solid #5568d3' : '3px solid transparent',
                      marginBottom: '-5px',
                      transition: 'all 0.2s ease',
                      borderRadius: '8px 8px 0 0'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'detailed') {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'detailed') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    🔍 Vue détaillée
                  </button>
                </div>

                {activeTab === 'global' ? (
                  <div>
                    <ComparisonMetricsTable
                      metricsByProfession={metricsByProfession}
                      professions={professions}
                    />
                  </div>
                ) : (
                  <ComparisonDetailView
                    professionIds={selectedProfessionIds}
                    professions={professions}
                  />
                )}
              </Card>

              {activeTab === 'global' && (
                <>
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📈</span>
                        <span>Score global</span>
                      </div>
                    } 
                    style={{ marginTop: '25px' }}
                  >
                    <p style={{ 
                      marginBottom: '15px', 
                      color: '#5a6268', 
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      Comparaison des scores globaux calculés pour chaque métier
                    </p>
                    <ComparisonBarChart
                      metricsByProfession={metricsByProfession}
                      professions={professions}
                      metricType="score"
                    />
                  </Card>

                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>⚖️</span>
                        <span>Total des importances</span>
                      </div>
                    } 
                    style={{ marginTop: '25px' }}
                  >
                    <p style={{ 
                      marginBottom: '15px', 
                      color: '#5a6268', 
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      Somme totale des importances de toutes les motivations clés
                    </p>
                    <ComparisonBarChart
                      metricsByProfession={metricsByProfession}
                      professions={professions}
                      metricType="weight"
                    />
                  </Card>

                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📊</span>
                        <span>Répartition par type</span>
                      </div>
                    } 
                    style={{ marginTop: '25px' }}
                  >
                    <p style={{ 
                      marginBottom: '15px', 
                      color: '#5a6268', 
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      Répartition des importances par type : Avantages, NSP, Désavantages
                    </p>
                    <ComparisonBarChart
                      metricsByProfession={metricsByProfession}
                      professions={professions}
                      metricType="types"
                    />
                  </Card>
                </>
              )}
            </>
          ) : (
            <Card>
              <Message type="info">
                <p style={{ margin: 0 }}>
                  Veuillez sélectionner au moins 2 métiers pour afficher la comparaison.
                </p>
              </Message>
            </Card>
          )}
        </>
      )}

      {/* Recommendation Button at bottom */}
      {hasSelection && selectedProfessionIds.length >= 2 && (
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderTop: '2px solid #e0e0e0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={handleGetRecommendation}
            className="comparison-recommendation-button"
            aria-label="Choisis pour moi"
            style={{
              flex: 1,
              padding: '18px 24px',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#ffffff',
              backgroundColor: '#5568d3',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(85, 104, 211, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4455b8';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(85, 104, 211, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5568d3';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(85, 104, 211, 0.3)';
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>🎯</span>
            <span>Choisis pour moi</span>
          </button>
          <button
            onClick={() => setShowRecommendationConfig(true)}
            className="comparison-config-button"
            style={{
              padding: '18px',
              fontSize: '1.3rem',
              backgroundColor: '#f8f9fa',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px',
              height: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f4ff';
              e.currentTarget.style.borderColor = '#5568d3';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(85, 104, 211, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="Configurer la recommandation"
            aria-label="Configurer la recommandation"
          >
            ⚙️
          </button>
        </div>
      )}

      {/* Recommendation Config Modal */}
      <RecommendationConfigModal
        isOpen={showRecommendationConfig}
        onClose={() => setShowRecommendationConfig(false)}
        preferences={recommendationPreferences}
        onPreferencesChange={handlePreferencesChange}
        professionIds={selectedProfessionIds}
      />

      {/* Recommendation Result Modal */}
      {showRecommendationModal && (
        <RecommendationModal
          recommendation={recommendationResult}
          onClose={() => setShowRecommendationModal(false)}
        />
      )}
    </div>
  );
}

export default ComparisonView;
