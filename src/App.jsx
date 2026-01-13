import React, { useState, useEffect } from 'react';
import { useProfessions } from './hooks/useProfessions';
import { useCategories } from './hooks/useCategories';
import { useNotifications } from './hooks/useNotifications';
import ProfessionTabs from './components/ProfessionTabs';
import ProfessionForm from './components/forms/ProfessionForm';
import ProfessionRenameForm from './components/forms/ProfessionRenameForm';
import CategoryForm from './components/forms/CategoryForm';
import CategoriesSidebar from './components/CategoriesSidebar';
import CategoryDetail from './components/CategoryDetail';
import SquareChart from './components/charts/SquareChart';
import ConfirmModal from './components/modals/ConfirmModal';
import DataMigrationModal from './components/modals/DataMigrationModal';
import Card from './components/ui/Card';
import Message from './components/ui/Message';
import EmptyState from './components/ui/EmptyState';
import { LIMITS } from './utils/constants';
import { loadCategories, loadCriteria, checkDataVersion, clearAllData, saveDataVersion } from './services/storage';

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

  // Data migration modal state
  const [dataMigrationModal, setDataMigrationModal] = useState({ 
    isOpen: false, 
    storedVersion: null, 
    currentVersion: null 
  });

  // Modal states
  const [deleteCategoryModal, setDeleteCategoryModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });
  const [deleteCriterionModal, setDeleteCriterionModal] = useState({ isOpen: false, categoryId: null, criterionId: null, criterionName: '' });
  const [updateCategoryModal, setUpdateCategoryModal] = useState({ isOpen: false, categoryId: null });
  const [deleteProfessionModal, setDeleteProfessionModal] = useState({ isOpen: false, professionId: null, professionName: '' });
  const [renameProfessionModal, setRenameProfessionModal] = useState({ isOpen: false, professionId: null });
  const [createCategoryModal, setCreateCategoryModal] = useState({ isOpen: false });
  
  // Selected category state
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  // Check data version on mount
  useEffect(() => {
    const versionCheck = checkDataVersion();
    
    if (versionCheck.needsMigration) {
      setDataMigrationModal({
        isOpen: true,
        storedVersion: versionCheck.storedVersion,
        currentVersion: versionCheck.currentVersion
      });
    } else {
      // Save current version if not already saved
      if (!versionCheck.storedVersion) {
        saveDataVersion();
      }
    }
  }, []);
  
  // Handle data reset
  const handleDataReset = () => {
    const success = clearAllData();
    if (success) {
      showSuccess('Données réinitialisées avec succès. La page va se recharger.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      showError('Erreur lors de la réinitialisation des données. Veuillez suivre les instructions manuelles.');
    }
  };
  
  // Check if localStorage.clear() is available (for automatic reset)
  const canResetAutomatically = () => {
    try {
      // Test if we can clear localStorage
      const testKey = '__test_reset__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Auto-select first category when categories change
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    } else if (categories.length === 0) {
      setSelectedCategoryId(null);
    } else if (selectedCategoryId && !categories.find(c => c.id === selectedCategoryId)) {
      // Selected category was deleted, select first one or null
      setSelectedCategoryId(categories.length > 0 ? categories[0].id : null);
    }
  }, [categories, selectedCategoryId]);

  // Wrapper functions that handle notifications and confirmations
  const onAddCategory = (categoryData) => {
    try {
      const newCategoryId = handleAddCategory(categoryData);
      showSuccess('Intérêt professionnel ajouté avec succès pour tous les métiers');
      // Select the newly created category
      if (newCategoryId) {
        setSelectedCategoryId(newCategoryId);
      }
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

  const handleCreateProfession = async (professionData) => {
    try {
      const newProfession = handleAddProfession(professionData);
      
      // If template is requested, create template data
      if (professionData.useTemplate) {
        const { generateProfessionTemplate } = await import('../utils/professionTemplate');
        const template = generateProfessionTemplate();
        
        // Create categories and criteria from template
        template.categories.forEach((categoryData) => {
          const categoryId = handleAddCategory({
            name: categoryData.name,
            color: categoryData.color
          });
          
          // Add criteria to the category
          categoryData.criteria.forEach((criterionData) => {
            handleAddCriterion(categoryId, {
              name: criterionData.name,
              weight: criterionData.weight,
              type: criterionData.type
            });
          });
        });
        
        showSuccess('Métier créé avec succès avec le modèle');
      } else {
        showSuccess('Métier créé avec succès');
      }
      
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
      const allCategories = loadCategories();
      const allCriteria = loadCriteria();
      const hasData = allCategories.length > 0 || allCriteria.length > 0;
      
      if (professions.length === 1 && hasData) {
        // Last profession with data - cannot delete
        showError('Impossible de supprimer le dernier métier tant qu\'il reste des intérêts professionnels ou des motivations clés. Supprimez d\'abord tous les intérêts professionnels et leurs motivations clés.');
        return;
      }
      
      if (professions.length === 1) {
        // Last profession without data - special confirmation
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
      if (err.message.includes('CANT_DELETE_LAST_PROFESSION_WITH_DATA')) {
        showError('Impossible de supprimer le dernier métier tant qu\'il reste des intérêts professionnels ou des motivations clés. Supprimez d\'abord tous les intérêts professionnels et leurs motivations clés.');
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
  
  // Get selected category
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

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
          <ProfessionForm onSubmit={handleCreateProfession} isFirstProfession={true} />
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
          <div className="app-content-two-columns">
            <div className="app-content-left">
              <Card title="📋 Mes intérêts professionnels">
                {categoriesLoading ? (
                  <EmptyState title="Chargement..." />
                ) : (
                  <CategoriesSidebar
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                    onCreateCategory={() => setCreateCategoryModal({ isOpen: true })}
                  />
                )}
              </Card>
            </div>
            
            <div className="app-content-right">
              <Card title="Détail de l'intérêt professionnel">
                <CategoryDetail
                  category={selectedCategory}
                  onUpdateCategory={onUpdateCategory}
                  onDeleteCategory={onDeleteCategory}
                  onAddCriterion={onAddCriterion}
                  onUpdateCriterion={onUpdateCriterion}
                  onDeleteCriterion={onDeleteCriterion}
                  existingCategories={allCategories}
                />
              </Card>
            </div>
          </div>

          <Card
            title="📈 Visualisation"
            subtitle={
              <div style={{ lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 12px 0' }}>
                  Le graphique ci-dessous représente vos <strong>intérêts professionnels</strong> et vos <strong>motivations clés</strong> pour ce métier.
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  <strong>Plus une motivation a une importance élevée, plus son carré sera grand.</strong>
                </p>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
                  Deux modes de visualisation disponibles :
                </p>
                <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Couleurs par catégorie</strong> : chaque intérêt professionnel a sa propre couleur
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Couleurs par type</strong> : les couleurs indiquent si une motivation est un avantage, un désavantage, ou neutre
                  </li>
                </ul>
                <p style={{ margin: '0', fontStyle: 'italic', color: '#5a6268' }}>
                  💡 La visualisation par type permet d'identifier rapidement les motivations positives et négatives pour ce métier.
                </p>
              </div>
            }
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
      <DataMigrationModal
        isOpen={dataMigrationModal.isOpen}
        onClose={() => setDataMigrationModal({ isOpen: false, storedVersion: null, currentVersion: null })}
        onReset={handleDataReset}
        storedVersion={dataMigrationModal.storedVersion}
        currentVersion={dataMigrationModal.currentVersion}
        canReset={canResetAutomatically()}
      />

      <ConfirmModal
        isOpen={deleteCategoryModal.isOpen}
        onClose={() => setDeleteCategoryModal({ isOpen: false, categoryId: null, categoryName: '' })}
        onConfirm={confirmDeleteCategory}
        title="Supprimer l'intérêt professionnel"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteCategoryModal.categoryName}" ? Cette action supprimera cet intérêt professionnel pour TOUS les métiers.`}
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
          ? `Êtes-vous sûr de vouloir supprimer "${deleteProfessionModal.professionName}" ? C'est le dernier métier. Cette action est possible car tous les intérêts professionnels et motivations clés ont déjà été supprimés.`
          : `Êtes-vous sûr de vouloir supprimer "${deleteProfessionModal.professionName}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        requireCheckbox={deleteProfessionModal.isLast}
        checkboxLabel={deleteProfessionModal.isLast ? "Je comprends que je supprime le dernier métier" : ""}
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

      {createCategoryModal.isOpen && (
        <div className="modal-overlay" onClick={() => setCreateCategoryModal({ isOpen: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
              ➕ Créer un intérêt professionnel
            </h2>
            <p style={{ marginBottom: '20px', color: '#7f8c8d' }}>
              Un intérêt professionnel regroupe plusieurs motivations clés. Choisissez un nom et une couleur pour l'identifier facilement.
            </p>
            {allCategories.length >= LIMITS.MAX_CATEGORIES ? (
              <Message type="error">
                Limite atteinte : vous ne pouvez pas ajouter plus de {LIMITS.MAX_CATEGORIES} intérêts professionnels
              </Message>
            ) : (
              <CategoryForm
                onSubmit={(categoryData) => {
                  onAddCategory(categoryData);
                  setCreateCategoryModal({ isOpen: false });
                }}
                existingCategories={allCategories}
              />
            )}
            <div style={{ marginTop: '15px', textAlign: 'center', color: '#7f8c8d', fontSize: '0.9rem' }}>
              {allCategories.length} / {LIMITS.MAX_CATEGORIES} intérêts professionnels créés
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
