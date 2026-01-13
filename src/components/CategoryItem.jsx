import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getCategoryTotalWeight } from '../services/storage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from './ui/IconButton';
import CategoryEditForm from './forms/CategoryEditForm';
import CritereList from './CritereList';
import CritereForm from './forms/CritereForm';
import Message from './ui/Message';
import { LIMITS } from '../utils/constants';

/**
 * Individual category item component
 */
const CategoryItem = ({
  category,
  isOpen,
  onToggle,
  onUpdate,
  onDelete,
  onAddCriterion,
  onUpdateCriterion,
  onDeleteCriterion,
  existingCategories
}) => {
  const [editing, setEditing] = useState(false);
  const [addingCriterion, setAddingCriterion] = useState(false);

  const categoryName = category.name;
  const categoryColor = category.color;
  const criteria = category.criteria || [];
  const hasCriteria = criteria.length > 0;
  const canDelete = !hasCriteria;

  const totalWeight = getCategoryTotalWeight(category);

  const handleUpdate = (updates) => {
    onUpdate(category.id, updates);
    setEditing(false);
  };

  const handleAddCriterion = (criterionData) => {
    onAddCriterion(category.id, criterionData);
    setAddingCriterion(false);
  };

  return (
    <div className="category-item">
      <div className="category-header">
        <div
          className="category-info clickable"
          onClick={() => onToggle()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label={
            hasCriteria
              ? `${categoryName}, ${criteria.length} motivation${criteria.length > 1 ? 's' : ''} clé${criteria.length > 1 ? 's' : ''}, cliquer pour ${isOpen ? 'fermer' : 'ouvrir'}`
              : `${categoryName}, aucune motivation clé, cliquer pour ajouter une motivation clé`
          }
        >
          <div
            className="category-color"
            style={{ backgroundColor: categoryColor }}
          />
          <div className="category-content">
            <div className="category-nom">
              {categoryName}
              <span className="accordion-icon">
                {isOpen ? (
                  <ExpandMoreIcon style={{ fontSize: '1.2rem' }} />
                ) : (
                  <ChevronRightIcon style={{ fontSize: '1.2rem' }} />
                )}
              </span>
            </div>
            <div className="category-details">
              {hasCriteria ? (
                <>
                  {criteria.length} motivation{criteria.length > 1 ? 's' : ''} clé{criteria.length > 1 ? 's' : ''} • Importance totale: {totalWeight}
                </>
              ) : (
                <span className="category-empty-hint">
                  Aucune motivation clé (ne s'affichera pas sur le graphique)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="category-actions">
          <IconButton
            icon={editing ? '✖️' : '✏️'}
            onClick={(e) => {
              e.stopPropagation();
              setEditing(!editing);
              setAddingCritere(false);
            }}
            tooltip={editing ? 'Annuler' : 'Modifier l\'intérêt professionnel'}
            ariaLabel={editing ? 'Annuler la modification' : `Modifier l'intérêt professionnel ${categoryName}`}
            style={{ color: categoryColor }}
            className="btn-icon-category"
          />
          <IconButton
            icon="🗑️"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category.id);
            }}
            tooltip={
              canDelete
                ? 'Supprimer l\'intérêt professionnel'
                : 'Impossible de supprimer : l\'intérêt professionnel contient des motivations clés. Supprimez d\'abord toutes les motivations clés.'
            }
            ariaLabel={
              canDelete
                ? `Supprimer l'intérêt professionnel ${categoryName}`
                : `Impossible de supprimer ${categoryName} : contient des motivations clés`
            }
            disabled={!canDelete}
            style={{ color: categoryColor }}
            className="btn-icon-category"
          />
        </div>
      </div>

      {editing && (
        <div className="category-edit-container">
          <CategoryEditForm
            category={category}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            existingCategories={existingCategories}
          />
        </div>
      )}

      {isOpen && (
        <div className="category-content-expanded">
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
                  category={category}
                  onUpdate={onUpdateCriterion}
                  onDelete={onDeleteCriterion}
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
                    background: categoryColor,
                    border: `2px solid ${categoryColor}`
                  }}
                  aria-label={`Ajouter une motivation clé à ${categoryName}`}
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

CategoryItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    criteria: PropTypes.array
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddCriterion: PropTypes.func.isRequired,
  onUpdateCriterion: PropTypes.func.isRequired,
  onDeleteCriterion: PropTypes.func.isRequired,
  existingCategories: PropTypes.array.isRequired
};

export default React.memo(CategoryItem);
