/**
 * Custom hook for managing categories and criteria with profession support
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  loadCriteria,
  addCriterion,
  updateCriterion,
  deleteCriterion,
  setCriterionWeight,
  getCategoriesForProfession
} from '../services/storage';
import {
  validateCategoryName,
  validateCriterionName,
  validateWeight,
  validateCategoryLimit,
  validateCriterionLimit,
  isColorUsed
} from '../utils/validation';

/**
 * Hook for managing categories and criteria for a specific profession
 * @param {number} professionId - Current profession ID
 * @returns {Object} Categories state and handlers
 */
export const useCategories = (professionId) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load categories for current profession from storage
   */
  const loadCategoriesFromStorage = useCallback(() => {
    try {
      setLoading(true);
      if (!professionId) {
        setCategories([]);
        return;
      }
      const loaded = getCategoriesForProfession(professionId);
      setCategories(loaded);
    } catch (err) {
      console.error('Error loading categories:', err);
      throw new Error('Erreur lors du chargement des intérêts professionnels');
    } finally {
      setLoading(false);
    }
  }, [professionId]);

  // Load categories when profession changes
  useEffect(() => {
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Add a new category (shared across all professions)
   */
  const handleAddCategory = useCallback((categoryData) => {
    const nameError = validateCategoryName(categoryData.name);
    if (nameError) {
      throw new Error(nameError);
    }

    const allCategories = loadCategories();
    const limitError = validateCategoryLimit(allCategories.length);
    if (limitError) {
      throw new Error(limitError);
    }

    if (isColorUsed(categoryData.color, allCategories)) {
      throw new Error('Cette couleur est déjà utilisée par un autre intérêt professionnel');
    }

    addCategory(categoryData);
    
    // Initialize weight for all professions with default value (15)
    if (professionId) {
      // Will be initialized when criteria are added
      loadCategoriesFromStorage();
    }
  }, [professionId, loadCategoriesFromStorage]);

  /**
   * Update a category (affects all professions)
   */
  const handleUpdateCategory = useCallback((categoryId, updates) => {
    const allCategories = loadCategories();
    
    if (updates.color && isColorUsed(updates.color, allCategories, categoryId)) {
      throw new Error('Cette couleur est déjà utilisée par un autre intérêt professionnel');
    }

    const updated = updateCategory(categoryId, updates);
    if (!updated) {
      throw new Error('Intérêt professionnel non trouvé');
    }

    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Delete a category (affects all professions)
   */
  const handleDeleteCategory = useCallback((id) => {
    deleteCategory(id);
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Add a criterion to a category (shared across all professions)
   */
  const handleAddCriterion = useCallback((categoryId, criterionData) => {
    const nameError = validateCriterionName(criterionData.name);
    if (nameError) {
      throw new Error(nameError);
    }

    const weightError = validateWeight(criterionData.weight);
    if (weightError) {
      throw new Error(weightError);
    }

    const allCategories = loadCategories();
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Intérêt professionnel non trouvé');
    }

    const allCriteria = loadCriteria();
    const categoryCriteria = allCriteria.filter(c => c.categoryId === categoryId);
    const criterionLimitError = validateCriterionLimit(categoryCriteria.length);
    if (criterionLimitError) {
      throw new Error(criterionLimitError);
    }

    const newCriterion = addCriterion(categoryId, { name: criterionData.name });
    
    // Set weight for current profession
    if (professionId) {
      setCriterionWeight(professionId, categoryId, newCriterion.id, criterionData.weight);
    }
    
    loadCategoriesFromStorage();
  }, [professionId, loadCategoriesFromStorage]);

  /**
   * Update a criterion (affects all professions for name, only current profession for weight)
   */
  const handleUpdateCriterion = useCallback((categoryId, criterionId, updates, silent = false) => {
    if (updates.weight !== undefined && professionId) {
      const weightError = validateWeight(updates.weight);
      if (weightError) {
        throw new Error(weightError);
      }
      // Update weight for current profession only
      setCriterionWeight(professionId, categoryId, criterionId, updates.weight);
    }
    
    if (updates.name !== undefined) {
      // Update name for all professions
      const updated = updateCriterion(criterionId, { name: updates.name });
      if (!updated) {
        throw new Error('Motivation clé non trouvée');
      }
    }

    loadCategoriesFromStorage();
  }, [professionId, loadCategoriesFromStorage]);

  /**
   * Delete a criterion (affects all professions)
   */
  const handleDeleteCriterion = useCallback((categoryId, criterionId) => {
    deleteCriterion(criterionId);
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  return {
    categories,
    loading,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddCriterion,
    handleUpdateCriterion,
    handleDeleteCriterion,
    reloadCategories: loadCategoriesFromStorage
  };
};

