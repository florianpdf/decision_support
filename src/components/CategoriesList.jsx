import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';
import EmptyState from './ui/EmptyState';

/**
 * List of categories with their criteria
 */
const CategoriesList = ({
  categories,
  onDeleteCategory,
  onUpdateCategory,
  onAddCritere,
  onDeleteCritere,
  onUpdateCritere,
  existingCategories
}) => {
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = useCallback((categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const toggleAllCategories = useCallback(() => {
    const allOpen = categories.every(cat => openCategories[cat.id]);
    const newState = {};
    categories.forEach(cat => {
      newState[cat.id] = !allOpen;
    });
    setOpenCategories(newState);
  }, [categories, openCategories]);

  // Expose toggle function globally for App component
  useEffect(() => {
    window.toggleAllCategoriesFn = toggleAllCategories;
    window.openCategoriesState = openCategories;
  }, [toggleAllCategories, openCategories]);

  if (categories.length === 0) {
    return (
      <EmptyState
        title="Aucun intérêt professionnel pour le moment"
        description="Utilisez le formulaire pour en ajouter"
      />
    );
  }

  return (
    <div className="categories-list">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isOpen={openCategories[category.id] || false}
          onToggle={() => toggleCategory(category.id)}
          onUpdate={onUpdateCategory}
          onDelete={onDeleteCategory}
          onAddCritere={onAddCritere}
          onUpdateCritere={onUpdateCritere}
          onDeleteCritere={onDeleteCritere}
          existingCategories={existingCategories || categories}
        />
      ))}
    </div>
  );
};

CategoriesList.propTypes = {
  categories: PropTypes.array.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
  onUpdateCategory: PropTypes.func.isRequired,
  onAddCritere: PropTypes.func.isRequired,
  onDeleteCritere: PropTypes.func.isRequired,
  onUpdateCritere: PropTypes.func.isRequired,
  existingCategories: PropTypes.array
};

export default React.memo(CategoriesList);
