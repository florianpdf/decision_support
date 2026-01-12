import React, { useState, useEffect } from 'react';
import { useCategories } from './hooks/useCategories';
import { useNotifications } from './hooks/useNotifications';
import CategoryForm from './components/forms/CategoryForm';
import CategoriesList from './components/CategoriesList';
import SquareChart from './components/charts/SquareChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from './components/Tooltip';
import Card from './components/ui/Card';
import Message from './components/ui/Message';
import EmptyState from './components/ui/EmptyState';
import Stats from './components/ui/Stats';
import { LIMITS } from './utils/constants';

/**
 * Main application component
 * Manages global state for categories and criteria with localStorage
 */
function App() {
  const {
    categories,
    loading,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddCritere,
    handleUpdateCritere,
    handleDeleteCritere
  } = useCategories();

  const { message, error, showSuccess, showError } = useNotifications();

  // Wrapper functions that handle notifications
  const onAddCategory = (categoryData) => {
    try {
      handleAddCategory(categoryData);
      showSuccess('Intérêt professionnel ajouté avec succès');
    } catch (err) {
      showError(err.message);
    }
  };

  const onUpdateCategory = (categoryId, updates) => {
    try {
      handleUpdateCategory(categoryId, updates);
      showSuccess('Intérêt professionnel modifié avec succès');
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteCategory = (id) => {
    try {
      handleDeleteCategory(id);
      showSuccess('Intérêt professionnel supprimé avec succès');
    } catch (err) {
      showError(err.message);
    }
  };

  const onAddCritere = (categoryId, critereData) => {
    try {
      handleAddCritere(categoryId, critereData);
      showSuccess('Motivation clé ajoutée avec succès');
    } catch (err) {
      showError(err.message);
    }
  };

  const onUpdateCritere = (categoryId, critereId, updates, silent = false) => {
    try {
      handleUpdateCritere(categoryId, critereId, updates, silent);
      if (!silent) {
        showSuccess('Motivation clé modifiée avec succès');
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteCritere = (categoryId, critereId) => {
    try {
      handleDeleteCritere(categoryId, critereId);
      showSuccess('Motivation clé supprimée avec succès');
    } catch (err) {
      showError(err.message);
    }
  };

  // Calculate statistics
  const totalCriteres = categories.reduce(
    (sum, cat) => sum + (cat.criteres ? cat.criteres.length : 0),
    0
  );

  const hasCategoriesWithCriteres = categories.some(
    cat => cat.criteres && cat.criteres.length > 0
  );

  // Track state of all categories (open/closed) for the toggle button
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);

  // Update state when categories open/close state changes
  useEffect(() => {
    const checkAllOpen = () => {
      if (!window.openCategoriesState) {
        setAllCategoriesOpen(false);
        return;
      }

      const categoriesWithCriteres = categories.filter(
        cat => cat.criteres && cat.criteres.length > 0
      );

      if (categoriesWithCriteres.length === 0) {
        setAllCategoriesOpen(false);
        return;
      }

      const allOpen = categoriesWithCriteres.every(
        cat => window.openCategoriesState[cat.id] === true
      );
      setAllCategoriesOpen(allOpen);
    };

    // Check immediately
    checkAllOpen();

    // Check periodically to catch state changes
    const interval = setInterval(checkAllOpen, 100);

    return () => clearInterval(interval);
  }, [categories]);

  return (
    <div className="app-container">
      <header className="app-header" role="banner">
        <h1>📊 Aide à la Décision</h1>
        <p>Identifiez vos intérêts professionnels et vos motivations clés pour visualiser vos priorités</p>
        <p className="app-header-hint">
          💡 Commencez par créer un intérêt professionnel, puis ajoutez-y vos motivations clés avec leur importance
        </p>
      </header>

      {message && <Message type="success">{message}</Message>}
      {error && <Message type="error">{error}</Message>}

      <div className="app-content">
        <Card
          title="➕ Créer un intérêt professionnel"
          subtitle="Un intérêt professionnel regroupe plusieurs motivations clés. Choisissez un nom et une couleur pour l'identifier facilement."
        >
          {categories.length >= LIMITS.MAX_CATEGORIES ? (
            <Message type="error">
              Limite atteinte : vous ne pouvez pas ajouter plus de {LIMITS.MAX_CATEGORIES} intérêts professionnels
            </Message>
          ) : (
            <CategoryForm
              onSubmit={onAddCategory}
              existingCategories={categories}
            />
          )}
          <Stats
            value={`${categories.length} / ${LIMITS.MAX_CATEGORIES}`}
            label="intérêts professionnels créés"
            className="stats-inline"
          />
        </Card>

        <Card
          title={
            <div className="card-title-with-action">
              <span>📋 Mes intérêts professionnels</span>
              {categories.some(cat => cat.criteres && cat.criteres.length > 0) && (
                <Tooltip content={allCategoriesOpen ? 'Tout fermer' : 'Tout ouvrir'}>
                  <button
                    className="btn-icon toggle-all-categories"
                    onClick={() => {
                      if (window.toggleAllCategoriesFn) {
                        window.toggleAllCategoriesFn();
                      }
                    }}
                    aria-label={allCategoriesOpen ? 'Tout fermer' : 'Tout ouvrir'}
                  >
                    <div className={`toggle-icon-wrapper ${allCategoriesOpen ? 'open' : 'closed'}`}>
                      {allCategoriesOpen ? (
                        <ExpandMoreIcon style={{ fontSize: '1.2rem' }} />
                      ) : (
                        <ChevronRightIcon style={{ fontSize: '1.2rem' }} />
                      )}
                    </div>
                  </button>
                </Tooltip>
              )}
            </div>
          }
        >
          {loading ? (
            <EmptyState title="Chargement..." />
          ) : (
            <CategoriesList
              categories={categories}
              onDeleteCategory={onDeleteCategory}
              onUpdateCategory={onUpdateCategory}
              onAddCritere={onAddCritere}
              onDeleteCritere={onDeleteCritere}
              onUpdateCritere={onUpdateCritere}
              existingCategories={categories}
            />
          )}
          {categories.length > 0 && (
            <Stats
              value={`${categories.length} intérêt${categories.length > 1 ? 's' : ''} professionnel${categories.length > 1 ? 's' : ''} • ${totalCriteres} motivation${totalCriteres > 1 ? 's' : ''} clé${totalCriteres > 1 ? 's' : ''} au total`}
              className="stats-inline"
            />
          )}
        </Card>
      </div>

      <Card
        title="📈 Visualisation"
        subtitle="Le graphique ci-dessous représente vos intérêts professionnels et vos motivations clés. Plus une motivation a une importance élevée, plus son carré sera grand."
      >
        {hasCategoriesWithCriteres ? (
          <SquareChart categories={categories} />
        ) : (
          <EmptyState
            title="Aucun intérêt professionnel avec motivations clés à afficher"
            description="Créez un intérêt professionnel et ajoutez-y des motivations clés pour voir apparaître le graphique"
          />
        )}
      </Card>
    </div>
  );
}

export default App;
