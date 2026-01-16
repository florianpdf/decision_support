import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';

const ONBOARDING_STORAGE_KEY = 'bulle_chart_onboarding_completed';

// Step content styles (extracted as constants for better performance)
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

const STEP_LIST_STYLE = {
  textAlign: 'left',
  margin: '8px 0',
  paddingLeft: '20px',
  fontSize: '0.95rem',
  lineHeight: '1.8',
  color: '#34495e',
};

const STEP_LIST_ITEM_STYLE = {
  marginBottom: '6px',
};

// Joyride styles configuration
const JOYRIDE_STYLES = {
  options: {
    primaryColor: '#3498db',
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
    backgroundColor: '#3498db',
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
    color: '#3498db',
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
 * Check if onboarding has been completed
 */
export const isOnboardingCompleted = () => {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Mark onboarding as completed
 */
export const markOnboardingCompleted = () => {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('Failed to save onboarding status:', error);
  }
};

/**
 * Reset onboarding status to allow restarting
 */
export const resetOnboarding = () => {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset onboarding status:', error);
  }
};

/**
 * Onboarding component using react-joyride
 * Shows a guided tour of the application features
 */
function Onboarding({ run, onComplete }) {
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
        setJoyrideKey(prev => prev + 1); // Force remount of Joyride
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Reset when onboarding stops
      setCurrentStepIndex(0);
      setIsRunning(false);
    }
  }, [run]);

  // Memoize steps to avoid recreating them on every render
  const steps = useMemo(() => [
      {
        target: '.profession-tabs',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>👋 Bienvenue !</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              Voici votre tableau de bord d'aide à la décision. Commençons par découvrir les fonctionnalités principales.
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Les onglets de métiers</strong> : Vous pouvez créer plusieurs métiers pour comparer vos motivations. Cliquez sur un onglet pour changer de métier.
            </p>
          </div>
        ),
        placement: 'bottom',
        disableBeacon: true,
      },
      {
        target: '.categories-sidebar button',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>📋 Intérêts professionnels</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Créer un intérêt professionnel</strong> : Cliquez sur ce bouton pour créer un nouveau groupe d'intérêts (ex: "Technique", "Relationnel", "Créatif").
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              Chaque intérêt professionnel peut contenir plusieurs motivations clés.
            </p>
          </div>
        ),
        placement: 'right',
      },
      {
        target: '.categories-list-sidebar',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>📝 Liste des intérêts</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Vos intérêts professionnels</strong> apparaissent ici. Cliquez sur un intérêt pour voir ses détails et ajouter des motivations clés.
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              Chaque intérêt a une couleur unique pour l'identifier facilement dans le graphique.
            </p>
          </div>
        ),
        placement: 'right',
      },
      {
        target: '.category-detail',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>✨ Détail d'un intérêt</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Dans cette section</strong>, vous pouvez :
            </p>
            <ul style={STEP_LIST_STYLE}>
              <li style={STEP_LIST_ITEM_STYLE}>Modifier le nom et la couleur de l'intérêt</li>
              <li style={STEP_LIST_ITEM_STYLE}>Ajouter des motivations clés</li>
              <li style={STEP_LIST_ITEM_STYLE}>Gérer les motivations existantes</li>
            </ul>
            <p style={{ ...STEP_PARAGRAPH_STYLE, marginTop: '12px' }}>
              Chaque motivation a une <strong>importance</strong> (1-30) et un <strong>type</strong> (avantage, désavantage, NSP).
            </p>
          </div>
        ),
        placement: 'left',
        scrollOffset: 300,
      },
      {
        target: '.square-chart-container',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>📈 Graphique de visualisation</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Ce graphique</strong> représente visuellement vos intérêts professionnels et motivations clés.
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Plus une motivation a une importance élevée, plus son carré sera grand.</strong>
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              Vous pouvez survoler les carrés pour voir les détails de chaque motivation.
            </p>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '.color-mode-switch',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>🎨 Modes de couleur</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Ce switch</strong> permet de changer le mode d'affichage des couleurs :
            </p>
            <ul style={STEP_LIST_STYLE}>
              <li style={STEP_LIST_ITEM_STYLE}>
                <strong>Couleurs par catégorie</strong> : Chaque intérêt professionnel a sa propre couleur
              </li>
              <li style={STEP_LIST_ITEM_STYLE}>
                <strong>Couleurs par type</strong> : Les couleurs indiquent si une motivation est un avantage (vert), un désavantage (rouge), ou neutre (orange)
              </li>
            </ul>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '.legend-container',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>📊 Légende</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>La légende</strong> affiche les statistiques selon le mode de couleur sélectionné :
            </p>
            <ul style={STEP_LIST_STYLE}>
              <li style={STEP_LIST_ITEM_STYLE}>
                En mode <strong>catégorie</strong> : Liste des intérêts professionnels avec leur poids total
              </li>
              <li style={STEP_LIST_ITEM_STYLE}>
                En mode <strong>type</strong> : Statistiques par type (avantage, désavantage, etc.)
              </li>
            </ul>
          </div>
        ),
        placement: 'top',
      },
      {
        target: '.fullscreen-chart-button',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>🔍 Vue plein écran</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Cliquez sur cette icône</strong> pour voir le graphique en plein écran dans une modale.
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              Utile pour mieux visualiser et analyser vos données.
            </p>
          </div>
        ),
        placement: 'left',
      },
      {
        target: '.restart-onboarding-button',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>🎓 Relancer l'onboarding</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              Vous pouvez à tout moment <strong>relancer cette visite guidée</strong> en cliquant sur cette icône en haut à droite.
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              Utile si vous avez besoin de vous rafraîchir la mémoire sur les fonctionnalités de l'application.
            </p>
          </div>
        ),
        placement: 'bottom',
      },
      {
        target: '.app-container',
        content: (
          <div style={STEP_CONTENT_STYLE}>
            <h3 style={STEP_TITLE_STYLE}>🎉 C'est terminé !</h3>
            <p style={STEP_PARAGRAPH_STYLE}>
              Vous connaissez maintenant les fonctionnalités principales de l'application.
            </p>
            <p style={STEP_PARAGRAPH_STYLE}>
              <strong>Conseil</strong> : Commencez par créer quelques intérêts professionnels, puis ajoutez des motivations clés avec leurs importances.
            </p>
            <p style={{ ...STEP_PARAGRAPH_STYLE, marginTop: '12px', fontStyle: 'italic', color: '#7f8c8d' }}>
              Bonne exploration ! 🚀
            </p>
          </div>
        ),
        placement: 'center',
      },
  ], []);

  const handleJoyrideCallback = useCallback((data) => {
    const { status, index, action, type, step } = data;

    // Update current step index whenever it changes
    if (index !== undefined && index !== null) {
      setCurrentStepIndex(index);
    }

    // Custom scroll handling for specific steps
    if (type === 'step:after' && step?.target === '.category-detail') {
      // Force scroll to top of the category detail section with extra offset
      setTimeout(() => {
        const element = document.querySelector('.category-detail');
        if (element) {
          const cardElement = element.closest('.card');
          if (cardElement) {
            const cardRect = cardElement.getBoundingClientRect();
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const targetScroll = currentScroll + cardRect.top - 100; // 100px offset from top
            
            window.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            });
          }
        }
      }, 150);
    }

    // Handle onboarding completion or cancellation
    if (status === 'finished') {
      // User completed the full tour
      markOnboardingCompleted();
      setIsRunning(false);
      onComplete?.();
    } else if (status === 'skipped' || action === 'close' || action === 'skip' || type === 'tour:end' || type === 'error:target_not_found') {
      // User skipped, closed, or target not found - don't mark as completed
      // Force immediate closure
      setIsRunning(false);
      onComplete?.();
    }
  }, [onComplete]);

  // Memoize locale to avoid recreating on every render
  const locale = useMemo(() => ({
    back: 'Précédent',
    close: 'Fermer',
    last: steps.length > 0 ? `Terminer (${steps.length}/${steps.length})` : 'Terminer',
    next: steps.length > 0 ? `Suivant (${currentStepIndex + 1}/${steps.length})` : 'Suivant',
    skip: 'Passer',
  }), [steps.length, currentStepIndex]);

  // Don't render if not running or no steps
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

Onboarding.propTypes = {
  run: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
};

export default Onboarding;
