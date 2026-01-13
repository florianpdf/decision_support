import React from 'react';
import PropTypes from 'prop-types';
import { getCategoryTotalWeight } from '../services/storage';

/**
 * Sidebar component displaying the list of categories
 * Clicking on a category selects it to show details in the right panel
 */
const CategoriesSidebar = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCreateCategory
}) => {
  return (
    <div className="categories-sidebar">
      <button
        className="btn btn-primary btn-full-width"
        onClick={onCreateCategory}
        style={{ marginBottom: '20px' }}
        aria-label="Créer un nouvel intérêt professionnel"
      >
        ➕ Créer un intérêt professionnel
      </button>

      {categories.length === 0 ? (
        <div className="empty-state-sidebar">
          <p>Aucun intérêt professionnel créé</p>
          <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: '10px' }}>
            Cliquez sur le bouton ci-dessus pour en créer un
          </p>
        </div>
      ) : (
        <div className="categories-list-sidebar">
          {categories.map((category) => {
            const criteria = category.criteria || [];
            const totalWeight = getCategoryTotalWeight(category);
            const isSelected = selectedCategoryId === category.id;

            return (
              <div
                key={category.id}
                className={`category-item-sidebar ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectCategory(category.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(category.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${category.name}, ${criteria.length} motivation${criteria.length > 1 ? 's' : ''} clé${criteria.length > 1 ? 's' : ''}, Importance totale: ${totalWeight}`}
              >
                <div
                  className="category-color-sidebar"
                  style={{ backgroundColor: category.color }}
                />
                <div className="category-info-sidebar">
                  <div className="category-name-sidebar">{category.name}</div>
                  <div className="category-stats-sidebar">
                    {criteria.length > 0 ? (
                      <>
                        {criteria.length} motivation{criteria.length > 1 ? 's' : ''} clé{criteria.length > 1 ? 's' : ''} • Total: {totalWeight}
                      </>
                    ) : (
                      <span style={{ color: '#95a5a6', fontStyle: 'italic' }}>
                        Aucune motivation clé
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

CategoriesSidebar.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategoryId: PropTypes.number,
  onSelectCategory: PropTypes.func.isRequired,
  onCreateCategory: PropTypes.func.isRequired
};

export default React.memo(CategoriesSidebar);
