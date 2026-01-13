import React, { useState, useEffect } from 'react';
import { useMetiers } from './hooks/useMetiers';
import { useCategories } from './hooks/useCategories';
import { useNotifications } from './hooks/useNotifications';
import MetierTabs from './components/MetierTabs';
import MetierForm from './components/forms/MetierForm';
import MetierRenameForm from './components/forms/MetierRenameForm';
import CategoryForm from './components/forms/CategoryForm';
import CategoriesList from './components/CategoriesList';
import SquareChart from './components/charts/SquareChart';
import ConfirmModal from './components/modals/ConfirmModal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from './components/Tooltip';
import Card from './components/ui/Card';
import Message from './components/ui/Message';
import EmptyState from './components/ui/EmptyState';
import Stats from './components/ui/Stats';
import { LIMITS } from './utils/constants';
import { loadCategories, loadCriteres } from './services/storage';

/**
 * Main application component
 * Manages metiers, categories and criteria with localStorage
 */
function App() {
  const {
    metiers,
    currentMetierId,
    currentMetier,
    loading: metiersLoading,
    handleAddMetier,
    handleUpdateMetier,
    handleDeleteMetier,
    setCurrentMetierId
  } = useMetiers();

  const {
    categories,
    loading: categoriesLoading,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddCritere,
    handleUpdateCritere,
    handleDeleteCritere
  } = useCategories(currentMetierId);

  const { message, error, showSuccess, showError } = useNotifications();

  // Modal states
  const [deleteCategoryModal, setDeleteCategoryModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });
  const [deleteCritereModal, setDeleteCritereModal] = useState({ isOpen: false, categoryId: null, critereId: null, critereName: '' });
  const [updateCategoryModal, setUpdateCategoryModal] = useState({ isOpen: false, categoryId: null });
  const [deleteMetierModal, setDeleteMetierModal] = useState({ isOpen: false, metierId: null, metierName: '' });
  const [renameMetierModal, setRenameMetierModal] = useState({ isOpen: false, metierId: null });

  // Wrapper functions that handle notifications and confirmations
  const onAddCategory = (categoryData) => {
    try {
      handleAddCategory(categoryData);
      showSuccess('Intérêt professionnel ajouté avec succès pour tous les métiers');
    } catch (err) {
      showError(err.message);
    }
  };

  const onUpdateCategory = (categoryId, updates) => {
    // Show confirmation modal for global update
    setUpdateCategoryModal({ isOpen: true, categoryId, updates });
  };

  const confirmUpdateCategory = () => {
    try {
      const { categoryId, updates } = updateCategoryModal;
      handleUpdateCategory(categoryId, updates);
      showSuccess('Intérêt professionnel modifié avec succès pour tous les métiers');
      setUpdateCategoryModal({ isOpen: false, categoryId: null });
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteCategory = (id) => {
    const allCategories = loadCategories();
    const category = allCategories.find(c => c.id === id);
    if (category) {
      setDeleteCategoryModal({ isOpen: true, categoryId: id, categoryName: category.nom });
    }
  };

  const confirmDeleteCategory = () => {
    try {
      handleDeleteCategory(deleteCategoryModal.categoryId);
      showSuccess('Intérêt professionnel supprimé avec succès pour tous les métiers');
      setDeleteCategoryModal({ isOpen: false, categoryId: null, categoryName: '' });
    } catch (err) {
      showError(err.message);
    }
  };

  const onAddCritere = (categoryId, critereData) => {
    try {
      handleAddCritere(categoryId, critereData);
      showSuccess('Motivation clé ajoutée avec succès pour tous les métiers');
    } catch (err) {
      showError(err.message);
    }
  };

  const onUpdateCritere = (categoryId, critereId, updates, silent = false) => {
    try {
      // If updating name, show confirmation
      if (updates.nom !== undefined && !silent) {
        // For name updates, we need confirmation
        // For now, we'll show a notification
        handleUpdateCritere(categoryId, critereId, updates, silent);
        showSuccess('Nom de la motivation clé modifié pour tous les métiers. Le poids reste spécifique à ce métier.');
      } else {
        // Weight updates are silent and specific to current metier
        handleUpdateCritere(categoryId, critereId, updates, true);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteCritere = (categoryId, critereId) => {
    const allCriteres = loadCriteres();
    const critere = allCriteres.find(c => c.id === critereId);
    if (critere) {
      setDeleteCritereModal({ isOpen: true, categoryId, critereId, critereName: critere.nom });
    }
  };

  const confirmDeleteCritere = () => {
    try {
      handleDeleteCritere(deleteCritereModal.categoryId, deleteCritereModal.critereId);
      showSuccess('Motivation clé supprimée avec succès pour tous les métiers');
      setDeleteCritereModal({ isOpen: false, categoryId: null, critereId: null, critereName: '' });
    } catch (err) {
      showError(err.message);
    }
  };

  // Metier handlers
  const onAddMetier = () => {
    setRenameMetierModal({ isOpen: true, metierId: null });
  };

  const handleCreateMetier = (metierData) => {
    try {
      handleAddMetier(metierData);
      showSuccess('Métier créé avec succès');
      setRenameMetierModal({ isOpen: false, metierId: null });
    } catch (err) {
      if (err.message.includes('CANT_DELETE_LAST_METIER')) {
        showError('Impossible de supprimer le dernier métier');
      } else {
        showError(err.message);
      }
    }
  };

  const onRenameMetier = (metierId) => {
    setRenameMetierModal({ isOpen: true, metierId });
  };

  const handleRenameMetier = (nom) => {
    try {
      if (renameMetierModal.metierId) {
        handleUpdateMetier(renameMetierModal.metierId, { nom });
        showSuccess('Métier renommé avec succès');
      } else {
        handleCreateMetier({ nom });
        return; // Already handled in handleCreateMetier
      }
      setRenameMetierModal({ isOpen: false, metierId: null });
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteMetier = (metierId) => {
    const metier = metiers.find(m => m.id === metierId);
    if (metier) {
      if (metiers.length === 1) {
        // Last metier - special confirmation
        setDeleteMetierModal({ 
          isOpen: true, 
          metierId, 
          metierName: metier.nom,
          isLast: true 
        });
      } else {
        setDeleteMetierModal({ 
          isOpen: true, 
          metierId, 
          metierName: metier.nom,
          isLast: false 
        });
      }
    }
  };

  const confirmDeleteMetier = () => {
    try {
      handleDeleteMetier(deleteMetierModal.metierId);
      showSuccess('Métier supprimé avec succès');
      setDeleteMetierModal({ isOpen: false, metierId: null, metierName: '' });
    } catch (err) {
      if (err.message.includes('CANT_DELETE_LAST_METIER')) {
        showError('Impossible de supprimer le dernier métier. Cela supprimerait tous les intérêts professionnels et motivations clés.');
      } else {
        showError(err.message);
      }
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

    checkAllOpen();
    const interval = setInterval(checkAllOpen, 100);
    return () => clearInterval(interval);
  }, [categories]);

  // If no metiers, show creation form
  if (metiersLoading) {
    return (
      <div className="app-container">
        <EmptyState title="Chargement..." />
      </div>
    );
  }

  if (metiers.length === 0) {
    return (
      <div className="app-container">
        <header className="app-header" role="banner">
          <h1>📊 Aide à la Décision</h1>
          <p>Créez votre premier métier pour commencer</p>
        </header>
        {message && <Message type="success">{message}</Message>}
        {error && <Message type="error">{error}</Message>}
        <Card title="➕ Créer votre premier métier">
          <MetierForm onSubmit={handleCreateMetier} />
        </Card>
      </div>
    );
  }

  const allCategories = loadCategories();

  return (
    <div className="app-container">
      <header className="app-header" role="banner">
        <h1>📊 Aide à la Décision</h1>
        <p>Identifiez vos intérêts professionnels et vos motivations clés pour visualiser vos priorités</p>
      </header>

      {message && <Message type="success">{message}</Message>}
      {error && <Message type="error">{error}</Message>}

      <MetierTabs
        metiers={metiers}
        currentMetierId={currentMetierId}
        onSelectMetier={setCurrentMetierId}
        onAddMetier={onAddMetier}
        onDeleteMetier={onDeleteMetier}
        onRenameMetier={onRenameMetier}
      />

      {currentMetier && (
        <>
          <div className="app-content">
            <Card
              title="➕ Créer un intérêt professionnel"
              subtitle="Un intérêt professionnel regroupe plusieurs motivations clés. Choisissez un nom et une couleur pour l'identifier facilement."
            >
              {allCategories.length >= LIMITS.MAX_CATEGORIES ? (
                <Message type="error">
                  Limite atteinte : vous ne pouvez pas ajouter plus de {LIMITS.MAX_CATEGORIES} intérêts professionnels
                </Message>
              ) : (
                <CategoryForm
                  onSubmit={onAddCategory}
                  existingCategories={allCategories}
                />
              )}
              <Stats
                value={`${allCategories.length} / ${LIMITS.MAX_CATEGORIES}`}
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
              {categoriesLoading ? (
                <EmptyState title="Chargement..." />
              ) : (
                <CategoriesList
                  categories={categories}
                  onDeleteCategory={onDeleteCategory}
                  onUpdateCategory={onUpdateCategory}
                  onAddCritere={onAddCritere}
                  onDeleteCritere={onDeleteCritere}
                  onUpdateCritere={onUpdateCritere}
                  existingCategories={allCategories}
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
            subtitle="Le graphique ci-dessous représente vos intérêts professionnels et vos motivations clés pour ce métier. Plus une motivation a une importance élevée, plus son carré sera grand."
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
        </>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={deleteCategoryModal.isOpen}
        onClose={() => setDeleteCategoryModal({ isOpen: false, categoryId: null, categoryName: '' })}
        onConfirm={confirmDeleteCategory}
        title="Supprimer l'intérêt professionnel"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteCategoryModal.categoryName}" ? Cette action supprimera cet intérêt professionnel et toutes ses motivations clés pour TOUS les métiers.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        requireCheckbox={true}
        checkboxLabel={`Je comprends que cela supprimera "${deleteCategoryModal.categoryName}" dans tous les métiers`}
        type="danger"
      />

      <ConfirmModal
        isOpen={deleteCritereModal.isOpen}
        onClose={() => setDeleteCritereModal({ isOpen: false, categoryId: null, critereId: null, critereName: '' })}
        onConfirm={confirmDeleteCritere}
        title="Supprimer la motivation clé"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteCritereModal.critereName}" ? Cette action supprimera cette motivation clé pour TOUS les métiers.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        requireCheckbox={true}
        checkboxLabel={`Je comprends que cela supprimera "${deleteCritereModal.critereName}" dans tous les métiers`}
        type="danger"
      />

      <ConfirmModal
        isOpen={updateCategoryModal.isOpen}
        onClose={() => setUpdateCategoryModal({ isOpen: false, categoryId: null })}
        onConfirm={confirmUpdateCategory}
        title="Modifier l'intérêt professionnel"
        message="Cette modification s'appliquera à TOUS les métiers. Êtes-vous sûr de vouloir continuer ?"
        confirmText="Modifier"
        cancelText="Annuler"
        type="warning"
      />

      <ConfirmModal
        isOpen={deleteMetierModal.isOpen}
        onClose={() => setDeleteMetierModal({ isOpen: false, metierId: null, metierName: '' })}
        onConfirm={confirmDeleteMetier}
        title={deleteMetierModal.isLast ? "Supprimer le dernier métier" : "Supprimer le métier"}
        message={deleteMetierModal.isLast 
          ? `Êtes-vous sûr de vouloir supprimer "${deleteMetierModal.metierName}" ? C'est le dernier métier. Cette action supprimera TOUS les intérêts professionnels et motivations clés.`
          : `Êtes-vous sûr de vouloir supprimer "${deleteMetierModal.metierName}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        requireCheckbox={deleteMetierModal.isLast}
        checkboxLabel={deleteMetierModal.isLast ? "Je comprends que cela supprimera tous les intérêts professionnels et motivations clés" : ""}
        type="danger"
      />

      {renameMetierModal.isOpen && (
        <div className="modal-overlay" onClick={() => setRenameMetierModal({ isOpen: false, metierId: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <MetierRenameForm
              metier={renameMetierModal.metierId ? metiers.find(m => m.id === renameMetierModal.metierId) : null}
              onSubmit={handleRenameMetier}
              onCancel={() => setRenameMetierModal({ isOpen: false, metierId: null })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
