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
      showSuccess('Professional interest added successfully for all professions');
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
      showSuccess('Professional interest updated successfully for all professions');
      setUpdateCategoryModal({ isOpen: false, categoryId: null });
    } catch (err) {
      showError(err.message);
    }
  };

  const onDeleteCategory = (id) => {
    const allCategories = loadCategories();
    const category = allCategories.find(c => c.id === id);
    if (category) {
      setDeleteCategoryModal({ isOpen: true, categoryId: id, categoryName: category.name || category.nom });
    }
  };

  const confirmDeleteCategory = () => {
    try {
      handleDeleteCategory(deleteCategoryModal.categoryId);
      showSuccess('Professional interest deleted successfully for all professions');
      setDeleteCategoryModal({ isOpen: false, categoryId: null, categoryName: '' });
    } catch (err) {
      showError(err.message);
    }
  };

  const onAddCriterion = (categoryId, criterionData) => {
    try {
      handleAddCriterion(categoryId, criterionData);
      showSuccess('Key motivation added successfully for all professions');
    } catch (err) {
      showError(err.message);
    }
  };

  const onUpdateCriterion = (categoryId, criterionId, updates, silent = false) => {
    try {
      // If updating name, show confirmation
      const name = updates.name !== undefined ? updates.name : updates.nom;
      if (name !== undefined && !silent) {
        // For name updates, we need confirmation
        // For now, we'll show a notification
        handleUpdateCriterion(categoryId, criterionId, updates, silent);
        showSuccess('Key motivation name updated for all professions. Weight remains specific to this profession.');
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
      setDeleteCriterionModal({ isOpen: true, categoryId, criterionId, criterionName: criterion.name || criterion.nom });
    }
  };

  const confirmDeleteCriterion = () => {
    try {
      handleDeleteCriterion(deleteCriterionModal.categoryId, deleteCriterionModal.criterionId);
      showSuccess('Key motivation deleted successfully for all professions');
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
      showSuccess('Profession created successfully');
      setRenameProfessionModal({ isOpen: false, professionId: null });
    } catch (err) {
      if (err.message.includes('CANT_DELETE_LAST_PROFESSION')) {
        showError('Cannot delete the last profession');
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
        showSuccess('Profession renamed successfully');
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
      showSuccess('Profession deleted successfully');
      setDeleteProfessionModal({ isOpen: false, professionId: null, professionName: '' });
    } catch (err) {
      if (err.message.includes('CANT_DELETE_LAST_PROFESSION')) {
        showError('Cannot delete the last profession. This would delete all professional interests and key motivations.');
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
        <EmptyState title="Loading..." />
      </div>
    );
  }

  if (professions.length === 0) {
    return (
      <div className="app-container">
        <header className="app-header" role="banner">
          <h1>📊 Decision Support</h1>
          <p>Create your first profession to get started</p>
        </header>
        {message && <Message type="success">{message}</Message>}
        {error && <Message type="error">{error}</Message>}
        <Card title="➕ Create Your First Profession">
          <ProfessionForm onSubmit={handleCreateProfession} />
        </Card>
      </div>
    );
  }

  const allCategories = loadCategories();

  return (
    <div className="app-container">
      <header className="app-header" role="banner">
        <h1>📊 Decision Support</h1>
        <p>Identify your professional interests and key motivations to visualize your priorities</p>
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
              title="➕ Create Professional Interest"
              subtitle="A professional interest groups several key motivations. Choose a name and a color to identify it easily."
            >
              {allCategories.length >= LIMITS.MAX_CATEGORIES ? (
                <Message type="error">
                  Limit reached: you cannot add more than {LIMITS.MAX_CATEGORIES} professional interests
                </Message>
              ) : (
                <CategoryForm
                  onSubmit={onAddCategory}
                  existingCategories={allCategories}
                />
              )}
              <Stats
                value={`${allCategories.length} / ${LIMITS.MAX_CATEGORIES}`}
                label="professional interests created"
                className="stats-inline"
              />
            </Card>

            <Card
              title={
                <div className="card-title-with-action">
                  <span>📋 My Professional Interests</span>
                  {categories.some(cat => cat.criteria && cat.criteria.length > 0) && (
                    <Tooltip content={allCategoriesOpen ? 'Close all' : 'Open all'}>
                      <button
                        className="btn-icon toggle-all-categories"
                        onClick={() => {
                          if (window.toggleAllCategoriesFn) {
                            window.toggleAllCategoriesFn();
                          }
                        }}
                        aria-label={allCategoriesOpen ? 'Close all' : 'Open all'}
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
                <EmptyState title="Loading..." />
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
                  value={`${categories.length} professional interest${categories.length > 1 ? 's' : ''} • ${totalCriteria} key motivation${totalCriteria > 1 ? 's' : ''} total`}
                  className="stats-inline"
                />
              )}
            </Card>
          </div>

          <Card
            title="📈 Visualization"
            subtitle="The chart below represents your professional interests and key motivations for this profession. The higher a motivation's importance, the larger its square will be."
          >
            {hasCategoriesWithCriteria ? (
              <SquareChart categories={categories} />
            ) : (
              <EmptyState
                title="No professional interest with key motivations to display"
                description="Create a professional interest and add key motivations to see the chart appear"
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
        title="Delete Professional Interest"
        message={`Are you sure you want to delete "${deleteCategoryModal.categoryName}"? This action will delete this professional interest and all its key motivations for ALL professions.`}
        confirmText="Delete"
        cancelText="Cancel"
        requireCheckbox={true}
        checkboxLabel={`I understand that this will delete "${deleteCategoryModal.categoryName}" in all professions`}
        type="danger"
      />

      <ConfirmModal
        isOpen={deleteCriterionModal.isOpen}
        onClose={() => setDeleteCriterionModal({ isOpen: false, categoryId: null, criterionId: null, criterionName: '' })}
        onConfirm={confirmDeleteCriterion}
        title="Delete Key Motivation"
        message={`Are you sure you want to delete "${deleteCriterionModal.criterionName}"? This action will delete this key motivation for ALL professions.`}
        confirmText="Delete"
        cancelText="Cancel"
        requireCheckbox={true}
        checkboxLabel={`I understand that this will delete "${deleteCriterionModal.criterionName}" in all professions`}
        type="danger"
      />

      <ConfirmModal
        isOpen={updateCategoryModal.isOpen}
        onClose={() => setUpdateCategoryModal({ isOpen: false, categoryId: null })}
        onConfirm={confirmUpdateCategory}
        title="Update Professional Interest"
        message="This update will apply to ALL professions. Are you sure you want to continue?"
        confirmText="Update"
        cancelText="Cancel"
        type="warning"
      />

      <ConfirmModal
        isOpen={deleteProfessionModal.isOpen}
        onClose={() => setDeleteProfessionModal({ isOpen: false, professionId: null, professionName: '' })}
        onConfirm={confirmDeleteProfession}
        title={deleteProfessionModal.isLast ? "Delete Last Profession" : "Delete Profession"}
        message={deleteProfessionModal.isLast 
          ? `Are you sure you want to delete "${deleteProfessionModal.professionName}"? This is the last profession. This action will delete ALL professional interests and key motivations.`
          : `Are you sure you want to delete "${deleteProfessionModal.professionName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        requireCheckbox={deleteProfessionModal.isLast}
        checkboxLabel={deleteProfessionModal.isLast ? "I understand that this will delete all professional interests and key motivations" : ""}
        type="danger"
      />

      {renameProfessionModal.isOpen && (
        <div className="modal-overlay" onClick={() => setRenameProfessionModal({ isOpen: false, professionId: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ProfessionRenameForm
              profession={renameProfessionModal.professionId ? professions.find(p => p.id === renameProfessionModal.professionId) : null}
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
