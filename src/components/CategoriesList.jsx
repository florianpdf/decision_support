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
  onAddCriterion,
  onDeleteCriterion,
  onUpdateCriterion,
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
        title="No professional interest at the moment"
        description="Use the form to add one"
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
          onAddCriterion={onAddCriterion}
          onUpdateCriterion={onUpdateCriterion}
          onDeleteCriterion={onDeleteCriterion}
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
  onAddCriterion: PropTypes.func.isRequired,
  onDeleteCriterion: PropTypes.func.isRequired,
  onUpdateCriterion: PropTypes.func.isRequired,
  existingCategories: PropTypes.array
};

export default React.memo(CategoriesList);
