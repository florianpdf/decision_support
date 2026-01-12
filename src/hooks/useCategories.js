/**
 * Custom hook for managing categories and criteria
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addCritereToCategory,
  updateCritereInCategory,
  deleteCritereFromCategory
} from '../services/storage';
import {
  validateCategoryName,
  validateCritereName,
  validateWeight,
  validateCategoryLimit,
  validateCritereLimit,
  isColorUsed
} from '../utils/validation';

/**
 * Hook for managing categories and criteria
 * @returns {Object} Categories state and handlers
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load categories from storage
   */
  const loadCategoriesFromStorage = useCallback(() => {
    try {
      setLoading(true);
      const loaded = loadCategories();
      setCategories(loaded);
    } catch (err) {
      console.error('Error loading categories:', err);
      throw new Error('Erreur lors du chargement des intérêts professionnels');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Add a new category
   */
  const handleAddCategory = useCallback((categoryData) => {
    const nameError = validateCategoryName(categoryData.nom);
    if (nameError) {
      throw new Error(nameError);
    }

    const limitError = validateCategoryLimit(categories.length);
    if (limitError) {
      throw new Error(limitError);
    }

    if (isColorUsed(categoryData.couleur, categories)) {
      throw new Error('Cette couleur est déjà utilisée par un autre intérêt professionnel');
    }

    addCategory(categoryData);
    loadCategoriesFromStorage();
  }, [categories, loadCategoriesFromStorage]);

  /**
   * Update a category
   */
  const handleUpdateCategory = useCallback((categoryId, updates) => {
    if (updates.couleur && isColorUsed(updates.couleur, categories, categoryId)) {
      throw new Error('Cette couleur est déjà utilisée par un autre intérêt professionnel');
    }

    const updated = updateCategory(categoryId, updates);
    if (!updated) {
      throw new Error('Intérêt professionnel non trouvé');
    }

    loadCategoriesFromStorage();
  }, [categories, loadCategoriesFromStorage]);

  /**
   * Delete a category
   */
  const handleDeleteCategory = useCallback((id) => {
    deleteCategory(id);
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Add a criterion to a category
   */
  const handleAddCritere = useCallback((categoryId, critereData) => {
    const nameError = validateCritereName(critereData.nom);
    if (nameError) {
      throw new Error(nameError);
    }

    const weightError = validateWeight(critereData.poids);
    if (weightError) {
      throw new Error(weightError);
    }

    const category = categories.find(c => c.id === categoryId);
    const critereLimitError = validateCritereLimit(category?.criteres?.length || 0);
    if (critereLimitError) {
      throw new Error(critereLimitError);
    }

    addCritereToCategory(categoryId, critereData);
    loadCategoriesFromStorage();
  }, [categories, loadCategoriesFromStorage]);

  /**
   * Update a criterion in a category
   */
  const handleUpdateCritere = useCallback((categoryId, critereId, updates, silent = false) => {
    if (updates.poids !== undefined) {
      const weightError = validateWeight(updates.poids);
      if (weightError) {
        throw new Error(weightError);
      }
    }

    const updated = updateCritereInCategory(categoryId, critereId, updates);
    if (!updated) {
      throw new Error('Motivation clé non trouvée');
    }

    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Delete a criterion from a category
   */
  const handleDeleteCritere = useCallback((categoryId, critereId) => {
    deleteCritereFromCategory(categoryId, critereId);
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  return {
    categories,
    loading,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddCritere,
    handleUpdateCritere,
    handleDeleteCritere,
    reloadCategories: loadCategoriesFromStorage
  };
};
