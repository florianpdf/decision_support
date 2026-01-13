import React, { useState, useEffect } from 'react';
import { useProfessions } from './hooks/useProfessions';
import { useCategories } from './hooks/useCategories';
import { useNotifications } from './hooks/useNotifications';
import ProfessionTabs from './components/ProfessionTabs';
import ProfessionForm from './components/forms/ProfessionForm';
import ProfessionRenameForm from './components/forms/ProfessionRenameForm';
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
import { loadCategories, loadCriteria } from './services/storage';

/**
 * Main application component
 * Manages professions, categories and criteria with localStorage
 */
function App() {
  const {
    professions,
    currentProfessionId,
    currentProfession,
    loading: professionsLoading,
    handleAddProfession,
    handleUpdateProfession,
    handleDeleteProfession,
    setCurrentProfessionId
  } = useProfessions();

  const {
    categories,
    loading: categoriesLoading,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddCriterion,
    handleUpdateCriterion,
    handleDeleteCriterion
  } = useCategories(currentProfessionId);

  const { message, error, showSuccess, showError } = useNotifications();

  // Modal states
  const [deleteCategoryModal, setDeleteCategoryModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });
  const [deleteCriterionModal, setDeleteCriterionModal] = useState({ isOpen: false, categoryId: null, criterionId: null, criterionName: '' });
  const [updateCategoryModal, setUpdateCategoryModal] = useState({ isOpen: false, categoryId: null });
  const [deleteProfessionModal, setDeleteProfessionModal] = useState({ isOpen: false, professionId: null, professionName: '' });
  const [renameProfessionModal, setRenameProfessionModal] = useState({ isOpen: false, professionId: null });

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
    if (!category) {
      return;
    }

    // Check if category has criteria
    const allCriteria = loadCriteria();
    const categoryCriteria = allCriteria.filter(c => c.categoryId === id);
    if (categoryCriteria.length > 0) {
      showError('Un intérêt professionnel ne peut pas être supprimé s\'il contient des motivations clés');
      return;
    }

    // If only one profession, delete directly without confirmation
    if (professions.length === 1) {
      try {
        handleDeleteCategory(id);
        showSuccess('Intérêt professionnel supprimé avec succès');
      } catch (err) {
        showError(err.message);
      }
      return;
    }

    // If two or more professions, show confirmation
    setDeleteCategoryModal({ isOpen: true, categoryId: id, categoryName: category.name });
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

  const onAddCriterion = (categoryId, criterionData) => {
    try {
      handleAddCriterion(categoryId, criterionData);
      showSuccess('Motivation clé ajoutée avec succès pour tous les métiers');
    } catch (err) {
      showError(err.message);
    }
  };

  const onUpdateCriterion = (categoryId, criterionId, updates, silent = false) => {
    try {
      // If updating name, show confirmation
      if (updates.name !== undefined && !silent) {
        // For name updates, we need confirmation
        // For now, we'll show a notification
        handleUpdateCriterion(categoryId, criterionId, updates, silent);
        showSuccess('Nom de la motivation clé modifié pour tous les métiers. Le poids reste spécifique à ce métier.');
      } else {
        // Weight updates are silent and specific to current profession
        handleUpdateCriterion(categoryId, criterionId, updates, true);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteCriterion = (categoryId, criterionId) => {
    const allCriteria = loadCriteria();
    const criterion = allCriteria.find(c => c.id === criterionId);
    if (criterion) {
      setDeleteCriterionModal({ isOpen: true, categoryId, criterionId, criterionName: criterion.name });
    }
  };

  const confirmDeleteCriterion = () => {
    try {
      handleDeleteCriterion(deleteCriterionModal.categoryId, deleteCriterionModal.criterionId);
      showSuccess('Motivation clé supprimée avec succès pour tous les métiers');
      setDeleteCriterionModal({ isOpen: false, categoryId: null, criterionId: null, criterionName: '' });
    } catch (err) {
      showError(err.message);
    }
  };

  // Profession handlers
  const onAddProfession = () => {
    setRenameProfessionModal({ isOpen: true, professionId: null });
  };

  const handleCreateProfession = (professionData) => {
    try {
      handleAddProfession(professionData);
      showSuccess('Métier créé avec succès');
      setRenameProfessionModal({ isOpen: false, professionId: null });
    } catch (err) {
      if (err.message.includes('CANT_DELETE_LAST_PROFESSION')) {
        showError('Impossible de supprimer le dernier métier');
      } else {
        showError(err.message);
      }
    }
  };

  const onRenameProfession = (professionId) => {
    setRenameProfessionModal({ isOpen: true, professionId });
  };

  const handleRenameProfession = (name) => {
    try {
      if (renameProfessionModal.professionId) {
        handleUpdateProfession(renameProfessionModal.professionId, { name });
        showSuccess('Métier renommé avec succès');
      } else {
        handleCreateProfession({ name });
        return; // Already handled in handleCreateProfession
      }
      setRenameProfessionModal({ isOpen: false, professionId: null });
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteProfession = (professionId) => {
    const profession = professions.find(p => p.id === professionId);
    if (profession) {
      if (professions.length === 1) {
        // Last profession - special confirmation
        setDeleteProfessionModal({ 
          isOpen: true, 
          professionId, 
          professionName: profession.name,
          isLast: true 
        });
      } else {
        setDeleteProfessionModal({ 
          isOpen: true, 
          professionId, 
          professionName: profession.name,
          isLast: false 
        });
      }
    }
  };

  const confirmDeleteProfession = () => {
    try {
      handleDeleteProfession(deleteProfessionModal.professionId);
      showSuccess('Métier supprimé avec succès');
      setDeleteProfessionModal({ isOpen: false, professionId: null, professionName: '' });
    } catch (err) {
      if (err.message.includes('CANT_DELETE_LAST_PROFESSION')) {
        showError('Impossible de supprimer le dernier métier. Cela supprimerait tous les intérêts professionnels et motivations clés.');
      } else {
        showError(err.message);
      }
    }
  };

  // Calculate statistics
  const totalCriteria = categories.reduce(
    (sum, cat) => sum + (cat.criteria ? cat.criteria.length : 0),
    0
  );

  const hasCategoriesWithCriteria = categories.some(
    cat => cat.criteria && cat.criteria.length > 0
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

      const categoriesWithCriteria = categories.filter(
        cat => cat.criteria && cat.criteria.length > 0
      );

      if (categoriesWithCriteria.length === 0) {
        setAllCategoriesOpen(false);
        return;
      }

      const allOpen = categoriesWithCriteria.every(
        cat => window.openCategoriesState[cat.id] === true
      );
      setAllCategoriesOpen(allOpen);
    };

    checkAllOpen();
    const interval = setInterval(checkAllOpen, 100);
    return () => clearInterval(interval);
  }, [categories]);

  // If no professions, show creation form
  if (professionsLoading) {
    return (
      <div className="app-container">
        <EmptyState title="Chargement..." />
      </div>
    );
  }

  if (professions.length === 0) {
    return (
      <div className="app-container">
        <header className="app-header" role="banner">
          <h1>📊 Aide à la Décision</h1>
          <p>Créez votre premier métier pour commencer</p>
        </header>
        {message && <Message type="success">{message}</Message>}
        {error && <Message type="error">{error}</Message>}
        <Card title="➕ Créer votre premier métier">
          <ProfessionForm onSubmit={handleCreateProfession} />
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

      <ProfessionTabs
        professions={professions}
        currentProfessionId={currentProfessionId}
        onSelectProfession={setCurrentProfessionId}
        onAddProfession={onAddProfession}
        onDeleteProfession={onDeleteProfession}
        onRenameProfession={onRenameProfession}
      />

      {currentProfession && (
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
                  {categories.some(cat => cat.criteria && cat.criteria.length > 0) && (
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
                  onAddCriterion={onAddCriterion}
                  onDeleteCriterion={onDeleteCriterion}
                  onUpdateCriterion={onUpdateCriterion}
                  existingCategories={allCategories}
                />
              )}
              {categories.length > 0 && (
                <Stats
                  value={`${categories.length} intérêt${categories.length > 1 ? 's' : ''} professionnel${categories.length > 1 ? 's' : ''} • ${totalCriteria} motivation${totalCriteria > 1 ? 's' : ''} clé${totalCriteria > 1 ? 's' : ''} au total`}
                  label=""
                  className="stats-inline"
                />
              )}
            </Card>
          </div>

          <Card
            title="📈 Visualisation"
            subtitle="Le graphique ci-dessous représente vos intérêts professionnels et vos motivations clés pour ce métier. Plus une motivation a une importance élevée, plus son carré sera grand."
          >
            {hasCategoriesWithCriteria ? (
              <SquareChart categories={categories} professionId={currentProfessionId} />
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
        isOpen={deleteCriterionModal.isOpen}
        onClose={() => setDeleteCriterionModal({ isOpen: false, categoryId: null, criterionId: null, criterionName: '' })}
        onConfirm={confirmDeleteCriterion}
        title="Supprimer la motivation clé"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteCriterionModal.criterionName}" ? Cette action supprimera cette motivation clé pour TOUS les métiers.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        requireCheckbox={true}
        checkboxLabel={`Je comprends que cela supprimera "${deleteCriterionModal.criterionName}" dans tous les métiers`}
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
        isOpen={deleteProfessionModal.isOpen}
        onClose={() => setDeleteProfessionModal({ isOpen: false, professionId: null, professionName: '' })}
        onConfirm={confirmDeleteProfession}
        title={deleteProfessionModal.isLast ? "Supprimer le dernier métier" : "Supprimer le métier"}
        message={deleteProfessionModal.isLast 
          ? `Êtes-vous sûr de vouloir supprimer "${deleteProfessionModal.professionName}" ? C'est le dernier métier. Cette action supprimera TOUS les intérêts professionnels et motivations clés.`
          : `Êtes-vous sûr de vouloir supprimer "${deleteProfessionModal.professionName}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        requireCheckbox={deleteProfessionModal.isLast}
        checkboxLabel={deleteProfessionModal.isLast ? "Je comprends que cela supprimera tous les intérêts professionnels et motivations clés" : ""}
        type="danger"
      />

      {renameProfessionModal.isOpen && (
        <div className="modal-overlay" onClick={() => setRenameProfessionModal({ isOpen: false, professionId: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
              {renameProfessionModal.professionId ? '✏️ Renommer le métier' : '➕ Créer un nouveau métier'}
            </h2>
            <ProfessionRenameForm
              profession={renameProfessionModal.professionId ? professions.find(p => p.id === renameProfessionModal.professionId) : undefined}
              onSubmit={handleRenameProfession}
              onCancel={() => setRenameProfessionModal({ isOpen: false, professionId: null })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
