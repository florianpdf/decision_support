/**
 * Comparison view component
 * Allows comparing up to 3 professions side by side
 */

import React, { useState, useEffect, useMemo } from 'react';
import { loadProfessions } from '../../services/storage';
import Card from '../ui/Card';
import Message from '../ui/Message';

/**
 * Comparison view component
 * @param {Object} props
 * @param {Function} props.onBack - Callback to return to main view
 */
function ComparisonView({ onBack }) {
  const [selectedProfessionIds, setSelectedProfessionIds] = useState([]);
  const [professions, setProfessions] = useState([]);

  // Load professions on mount
  useEffect(() => {
    const loaded = loadProfessions();
    setProfessions(loaded);
    
    // By default, select all professions (up to 3)
    if (loaded.length >= 2) {
      const defaultSelection = loaded.slice(0, 3).map(p => p.id);
      setSelectedProfessionIds(defaultSelection);
    }
  }, []);

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

  return (
    <div className="comparison-view">
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '8px 16px' }}
        >
          ← Retour
        </button>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>
          📊 Comparaison des métiers
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
          <Card title="Sélection des métiers à comparer">
            <p style={{ marginBottom: '15px', color: '#7f8c8d' }}>
              Sélectionnez jusqu'à 3 métiers à comparer (minimum 2 requis) :
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                      padding: '12px',
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
                    <span style={{ fontWeight: isSelected ? '600' : '400', fontSize: '1rem' }}>
                      {profession.name}
                    </span>
                    {isDisabled && (
                      <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#7f8c8d' }}>
                        (Maximum 3 métiers)
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            {selectedProfessionIds.length > 0 && (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <strong>{selectedProfessionIds.length}</strong> métier{selectedProfessionIds.length > 1 ? 's' : ''} sélectionné{selectedProfessionIds.length > 1 ? 's' : ''}
              </div>
            )}
          </Card>

          {hasSelection ? (
            <Card title="Vue de comparaison">
              <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                Les visualisations de comparaison seront affichées ici (à implémenter).
              </p>
              <p style={{ marginTop: '10px', color: '#7f8c8d' }}>
                Métiers sélectionnés : {selectedProfessionIds.map(id => {
                  const prof = professions.find(p => p.id === id);
                  return prof ? prof.name : '';
                }).filter(Boolean).join(', ')}
              </p>
            </Card>
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
    </div>
  );
}

export default ComparisonView;
