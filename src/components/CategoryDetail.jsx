import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCategoryTotalWeight } from '../services/storage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from './ui/IconButton';
import CategoryEditForm from './forms/CategoryEditForm';
import CritereList from './CritereList';
import CritereForm from './forms/CritereForm';
import Message from './ui/Message';
import EmptyState from './ui/EmptyState';
import Tooltip from './Tooltip';
import { LIMITS } from '../utils/constants';

/**
 * Component displaying the detail of a selected category
 * Shows category info, criteria list, and allows editing
 */
const CategoryDetail = ({
  category,
  onUpdateCategory,
  onDeleteCategory,
  onAddCriterion,
  onUpdateCriterion,
  onDeleteCriterion,
  existingCategories
}) => {
  const [editing, setEditing] = useState(false);
  const [addingCriterion, setAddingCriterion] = useState(false);
  const [allCriteriaOpen, setAllCriteriaOpen] = useState(false);
  const critereListRef = useRef(null);

  // Get criteria early to avoid initialization issues
  const criteria = category?.criteria || [];

  // Update allCriteriaOpen state when criteria change
  useEffect(() => {
    if (criteria.length === 0) {
      setAllCriteriaOpen(false);
    }
  }, [criteria.length]);

  const toggleAllCriteria = () => {
    const newState = !allCriteriaOpen;
    setAllCriteriaOpen(newState);
    if (critereListRef.current && critereListRef.current.toggleAll) {
      critereListRef.current.toggleAll(newState);
    }
  };

  if (!category) {
    return (
      <div className="category-detail">
        <EmptyState
          title="Aucun intérêt professionnel sélectionné"
          description="Sélectionnez un intérêt professionnel dans la liste de gauche pour voir ses détails"
        />
      </div>
    );
  }
  const hasCriteria = criteria.length > 0;
  const canDelete = !hasCriteria;
  const totalWeight = getCategoryTotalWeight(category);

  const handleUpdate = (updates) => {
    onUpdateCategory(category.id, updates);
    setEditing(false);
  };

  const handleAddCriterion = (criterionData) => {
    onAddCriterion(category.id, criterionData);
    setAddingCriterion(false);
  };

  return (
    <div className="category-detail">
      <div className="category-detail-header">
        <div className="category-detail-title">
          <div
            className="category-color-detail"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {category.name}
              {hasCriteria && (
                <Tooltip content={allCriteriaOpen ? 'Tout fermer' : 'Tout ouvrir'}>
                  <button
                    className="btn-icon toggle-all-criteria"
                    onClick={toggleAllCriteria}
                    aria-label={allCriteriaOpen ? 'Tout fermer' : 'Tout ouvrir'}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className={`toggle-icon-wrapper ${allCriteriaOpen ? 'open' : 'closed'}`}>
                      {allCriteriaOpen ? (
                        <ExpandMoreIcon style={{ fontSize: '1.2rem', color: category.color }} />
                      ) : (
                        <ChevronRightIcon style={{ fontSize: '1.2rem', color: category.color }} />
                      )}
                    </div>
                  </button>
                </Tooltip>
              )}
            </h2>
            <div className="category-detail-stats">
              {hasCriteria ? (
                <>
                  {criteria.length} motivation{criteria.length > 1 ? 's' : ''} clé{criteria.length > 1 ? 's' : ''} • Importance totale: {totalWeight}
                </>
              ) : (
                <span style={{ color: '#95a5a6', fontStyle: 'italic' }}>
                  Aucune motivation clé (ne s'affichera pas sur le graphique)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="category-detail-actions">
          <IconButton
            icon={editing ? '✖️' : '✏️'}
            onClick={() => {
              setEditing(!editing);
              setAddingCriterion(false);
            }}
            tooltip={editing ? 'Annuler' : 'Modifier l\'intérêt professionnel'}
            ariaLabel={editing ? 'Annuler la modification' : `Modifier l'intérêt professionnel ${category.name}`}
            style={{ color: category.color }}
            className="btn-icon-category"
          />
          <IconButton
            icon="🗑️"
            onClick={() => onDeleteCategory(category.id)}
            tooltip={
              canDelete
                ? 'Supprimer l\'intérêt professionnel'
                : 'Impossible de supprimer : l\'intérêt professionnel contient des motivations clés. Supprimez d\'abord toutes les motivations clés.'
            }
            ariaLabel={
              canDelete
                ? `Supprimer l'intérêt professionnel ${category.name}`
                : `Impossible de supprimer ${category.name} : contient des motivations clés`
            }
            disabled={!canDelete}
            style={{ color: category.color }}
            className="btn-icon-category"
          />
        </div>
      </div>

      {editing ? (
        <div className="category-edit-container">
          <CategoryEditForm
            category={category}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            existingCategories={existingCategories}
          />
        </div>
      ) : (
        <div className="category-detail-content">
          {addingCriterion ? (
            <div className="critere-form-container">
              <CritereForm
                categoryId={category.id}
                onSubmit={handleAddCriterion}
                onCancel={() => setAddingCriterion(false)}
              />
            </div>
          ) : (
            <>
              {hasCriteria && (
                <CritereList
                  ref={critereListRef}
                  category={category}
                  onUpdate={onUpdateCriterion}
                  onDelete={onDeleteCriterion}
                  onToggleStateChange={setAllCriteriaOpen}
                />
              )}
              {criteria.length >= LIMITS.MAX_CRITERES_PER_CATEGORY ? (
                <Message type="error" className="message-inline">
                  ⚠️ Limite atteinte : {LIMITS.MAX_CRITERES_PER_CATEGORY} motivations clés maximum par intérêt professionnel
                </Message>
              ) : (
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => {
                    setAddingCriterion(true);
                    setEditing(false);
                  }}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    justifyContent: 'center',
                    background: category.color,
                    border: `2px solid ${category.color}`
                  }}
                  aria-label={`Ajouter une motivation clé à ${category.name}`}
                >
                  ➕ Ajouter une motivation clé ({criteria.length} / {LIMITS.MAX_CRITERES_PER_CATEGORY})
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

CategoryDetail.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    criteria: PropTypes.array
  }),
  onUpdateCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
  onAddCriterion: PropTypes.func.isRequired,
  onUpdateCriterion: PropTypes.func.isRequired,
  onDeleteCriterion: PropTypes.func.isRequired,
  existingCategories: PropTypes.array.isRequired
};

export default React.memo(CategoryDetail);
