/**
 * Onboarding component for the comparison view
 * Shows a guided tour of the comparison features
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';

const COMPARISON_ONBOARDING_STORAGE_KEY = 'bulle_chart_comparison_onboarding_completed';

// Step content styles
const STEP_CONTENT_STYLE = {
  padding: '4px 0',
};

const STEP_TITLE_STYLE = {
  margin: '0 0 12px 0',
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#2c3e50',
  lineHeight: '1.4',
};

const STEP_PARAGRAPH_STYLE = {
  margin: '0 0 10px 0',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  color: '#34495e',
};

// Joyride styles configuration
const JOYRIDE_STYLES = {
  options: {
    primaryColor: '#5568d3',
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: 12,
    padding: '24px',
    maxWidth: '500px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
  tooltipContainer: {
    textAlign: 'left',
  },
  buttonNext: {
    backgroundColor: '#5568d3',
    color: '#fff',
    borderRadius: 6,
    padding: '10px 20px',
    fontSize: '0.95rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonBack: {
    color: '#5568d3',
    marginRight: 12,
    fontSize: '0.95rem',
    padding: '10px 16px',
    fontWeight: '500',
  },
  buttonSkip: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    padding: '10px 16px',
  },
  spotlight: {
    borderRadius: 8,
  },
};

/**
 * Check if comparison onboarding has been completed
 */
export const isComparisonOnboardingCompleted = () => {
  try {
    return localStorage.getItem(COMPARISON_ONBOARDING_STORAGE_KEY) === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Mark comparison onboarding as completed
 */
export const markComparisonOnboardingCompleted = () => {
  try {
    localStorage.setItem(COMPARISON_ONBOARDING_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('Failed to save comparison onboarding status:', error);
  }
};

/**
 * Reset comparison onboarding status to allow restarting
 */
export const resetComparisonOnboarding = () => {
  try {
    localStorage.removeItem(COMPARISON_ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset comparison onboarding status:', error);
  }
};

/**
 * Comparison onboarding component using react-joyride
 */
function ComparisonOnboarding({ run, onComplete, hasSelection }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [joyrideKey, setJoyrideKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Reset step index and force remount when run changes from false to true
  useEffect(() => {
    if (run) {
      setCurrentStepIndex(0);
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsRunning(true);
        setJoyrideKey(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentStepIndex(0);
      setIsRunning(false);
    }
  }, [run]);

  // Memoize steps
  const steps = useMemo(() => {
    const baseSteps = [
      {
        target: '.comparison-view h1',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>📊 Page de comparaison</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              Bienvenue dans la page de comparaison ! Ici, vous pouvez comparer jusqu'à <strong>3 métiers</strong> côte à côte pour identifier celui qui correspond le mieux à vos motivations.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '.comparison-view .card',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>✅ Sélection des métiers</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Sélectionnez les métiers à comparer</strong> : Cochez les métiers que vous souhaitez comparer (minimum 2, maximum 3).
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              Les métiers sélectionnés apparaîtront dans les tableaux et graphiques ci-dessous.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
    ];

    if (hasSelection) {
      baseSteps.push(
        {
          target: '.comparison-tabs',
          content: (
            <div style={STEP_CONTENT_STYLE}>
              <h3 style={STEP_TITLE_STYLE}>📑 Niveaux de détail</h3>
              <p style={STEP_PARAGRAPH_STYLE}>
                <strong>Vue globale</strong> : Affiche les métriques principales (scores, totaux, répartition) sous forme de tableaux et graphiques.
              </p>
              <p style={STEP_PARAGRAPH_STYLE}>
                <strong>Vue détaillée</strong> : Affiche tous les intérêts professionnels et motivations clés pour chaque métier, avec possibilité de comparaison en tableau.
              </p>
            </div>
          ),
          placement: 'bottom',
          disableBeacon: true,
        },
        {
          target: '.comparison-recommendation-button',
          content: (
            <div style={STEP_CONTENT_STYLE}>
              <h3 style={STEP_TITLE_STYLE}>🎯 Recommandation automatique</h3>
              <p style={STEP_PARAGRAPH_STYLE}>
                <strong>Bouton "Choisis pour moi"</strong> : Cliquez sur ce bouton pour obtenir une recommandation automatique du métier le plus adapté à vos motivations.
              </p>
              <p style={STEP_PARAGRAPH_STYLE}>
                L'algorithme analyse vos importances, types de motivations et intérêts professionnels pour vous proposer le meilleur choix.
              </p>
            </div>
          ),
          placement: 'top',
          disableBeacon: true,
        },
        {
          target: '.comparison-config-button',
          content: (
            <div style={STEP_CONTENT_STYLE}>
              <h3 style={STEP_TITLE_STYLE}>⚙️ Configuration</h3>
              <p style={STEP_PARAGRAPH_STYLE}>
                <strong>Icône de configuration</strong> : Cliquez sur cette icône pour personnaliser les critères de recommandation.
              </p>
              <p style={STEP_PARAGRAPH_STYLE}>
                Vous pouvez ajuster l'importance des avantages/désavantages et définir des priorités par intérêt professionnel.
              </p>
            </div>
          ),
          placement: 'top',
          disableBeacon: true,
        }
      );
    }

    return baseSteps;
  }, [hasSelection]);

  const handleJoyrideCallback = useCallback((data) => {
    const { status, action, type, index } = data;

    // Update current step index
    if (action === 'next' || action === 'prev') {
      setCurrentStepIndex(index);
    }

    // Handle target not found - Joyride will skip automatically
    if (type === 'error:target_not_found') {
      // Joyride automatically skips to next step, so we just return
      return;
    }

    // Handle onboarding completion or cancellation
    if (status === 'finished') {
      markComparisonOnboardingCompleted();
      setIsRunning(false);
      onComplete?.();
    } else if (status === 'skipped' || action === 'close' || action === 'skip' || type === 'tour:end') {
      setIsRunning(false);
      onComplete?.();
    }
  }, [onComplete]);

  const locale = useMemo(() => ({
    back: 'Précédent',
    close: 'Fermer',
    last: steps.length > 0 ? `Terminer (${steps.length}/${steps.length})` : 'Terminer',
    next: steps.length > 0 ? `Suivant (${currentStepIndex + 1}/${steps.length})` : 'Suivant',
    skip: 'Passer',
  }), [steps.length, currentStepIndex]);

  if (!run || !isRunning || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      key={joyrideKey}
      steps={steps}
      run={isRunning}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={JOYRIDE_STYLES}
      locale={locale}
      disableCloseOnEsc={false}
      disableOverlayClose={false}
      spotlightClicks={false}
      scrollOffset={200}
      scrollToFirstStep={false}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
}

ComparisonOnboarding.propTypes = {
  run: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  hasSelection: PropTypes.bool,
};

export default ComparisonOnboarding;
