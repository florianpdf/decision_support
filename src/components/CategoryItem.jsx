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
  onAddCritere,
  onUpdateCritere,
  onDeleteCritere,
  existingCategories
}) => {
  const [editing, setEditing] = useState(false);
  const [addingCritere, setAddingCritere] = useState(false);

  const totalWeight = getCategoryTotalWeight(category);
  const hasCriteres = category.criteres && category.criteres.length > 0;
  const canDelete = !hasCriteres;

  const handleUpdate = (updates) => {
    onUpdate(category.id, updates);
    setEditing(false);
  };

  const handleAddCritere = (critereData) => {
    onAddCritere(category.id, critereData);
    setAddingCritere(false);
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
            hasCriteres
              ? `${category.nom}, ${category.criteres.length} motivation${category.criteres.length > 1 ? 's' : ''} clé${category.criteres.length > 1 ? 's' : ''}, cliquer pour ${isOpen ? 'fermer' : 'ouvrir'}`
              : `${category.nom}, aucune motivation clé, cliquer pour ajouter une motivation clé`
          }
        >
          <div
            className="category-color"
            style={{ backgroundColor: category.couleur }}
          />
          <div className="category-content">
            <div className="category-nom">
              {category.nom}
              <span className="accordion-icon">
                {isOpen ? (
                  <ExpandMoreIcon style={{ fontSize: '1.2rem' }} />
                ) : (
                  <ChevronRightIcon style={{ fontSize: '1.2rem' }} />
                )}
              </span>
            </div>
            <div className="category-details">
              {hasCriteres ? (
                <>
                  {category.criteres.length} motivation{category.criteres.length > 1 ? 's' : ''} clé{category.criteres.length > 1 ? 's' : ''} • Importance totale: {totalWeight}
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
            ariaLabel={editing ? 'Annuler la modification' : `Modifier l'intérêt professionnel ${category.nom}`}
            style={{ color: category.couleur }}
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
                ? `Supprimer l'intérêt professionnel ${category.nom}`
                : `Impossible de supprimer ${category.nom} : contient des motivations clés`
            }
            disabled={!canDelete}
            style={{ color: category.couleur }}
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
          {addingCritere ? (
            <div className="critere-form-container">
              <CritereForm
                categoryId={category.id}
                onSubmit={handleAddCritere}
                onCancel={() => setAddingCritere(false)}
              />
            </div>
          ) : (
            <>
              {hasCriteres && (
                <CritereList
                  category={category}
                  onUpdate={onUpdateCritere}
                  onDelete={onDeleteCritere}
                />
              )}
              {category.criteres && category.criteres.length >= LIMITS.MAX_CRITERES_PER_CATEGORY ? (
                <Message type="error" className="message-inline">
                  ⚠️ Limite atteinte : {LIMITS.MAX_CRITERES_PER_CATEGORY} motivations clés maximum par intérêt professionnel
                </Message>
              ) : (
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => {
                    setAddingCritere(true);
                    setEditing(false);
                  }}
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    justifyContent: 'center',
                    background: category.couleur,
                    border: `2px solid ${category.couleur}`
                  }}
                  aria-label={`Ajouter une motivation clé à ${category.nom}`}
                >
                  ➕ Ajouter une motivation clé ({category.criteres ? category.criteres.length : 0} / {LIMITS.MAX_CRITERES_PER_CATEGORY})
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
    nom: PropTypes.string.isRequired,
    couleur: PropTypes.string.isRequired,
    criteres: PropTypes.array
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddCritere: PropTypes.func.isRequired,
  onUpdateCritere: PropTypes.func.isRequired,
  onDeleteCritere: PropTypes.func.isRequired,
  existingCategories: PropTypes.array.isRequired
};

export default React.memo(CategoryItem);
