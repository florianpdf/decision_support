/**
 * Custom hook for managing categories and criteria with metier support
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  loadCriteres,
  addCritere,
  updateCritere,
  deleteCritere,
  setCritereWeight,
  getCategoriesForMetier
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
 * Hook for managing categories and criteria for a specific metier
 * @param {number} metierId - Current metier ID
 * @returns {Object} Categories state and handlers
 */
export const useCategories = (metierId) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load categories for current metier from storage
   */
  const loadCategoriesFromStorage = useCallback(() => {
    try {
      setLoading(true);
      if (!metierId) {
        setCategories([]);
        return;
      }
      const loaded = getCategoriesForMetier(metierId);
      setCategories(loaded);
    } catch (err) {
      console.error('Error loading categories:', err);
      throw new Error('Erreur lors du chargement des intérêts professionnels');
    } finally {
      setLoading(false);
    }
  }, [metierId]);

  // Load categories when metier changes
  useEffect(() => {
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Add a new category (shared across all metiers)
   */
  const handleAddCategory = useCallback((categoryData) => {
    const nameError = validateCategoryName(categoryData.nom);
    if (nameError) {
      throw new Error(nameError);
    }

    const allCategories = loadCategories();
    const limitError = validateCategoryLimit(allCategories.length);
    if (limitError) {
      throw new Error(limitError);
    }

    if (isColorUsed(categoryData.couleur, allCategories)) {
      throw new Error('Cette couleur est déjà utilisée par un autre intérêt professionnel');
    }

    addCategory(categoryData);
    
    // Initialize weight for all metiers with default value (15)
    if (metierId) {
      // Will be initialized when criteres are added
      loadCategoriesFromStorage();
    }
  }, [metierId, loadCategoriesFromStorage]);

  /**
   * Update a category (affects all metiers)
   */
  const handleUpdateCategory = useCallback((categoryId, updates) => {
    const allCategories = loadCategories();
    
    if (updates.couleur && isColorUsed(updates.couleur, allCategories, categoryId)) {
      throw new Error('Cette couleur est déjà utilisée par un autre intérêt professionnel');
    }

    const updated = updateCategory(categoryId, updates);
    if (!updated) {
      throw new Error('Intérêt professionnel non trouvé');
    }

    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Delete a category (affects all metiers)
   */
  const handleDeleteCategory = useCallback((id) => {
    deleteCategory(id);
    loadCategoriesFromStorage();
  }, [loadCategoriesFromStorage]);

  /**
   * Add a criterion to a category (shared across all metiers)
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

    const allCategories = loadCategories();
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Intérêt professionnel non trouvé');
    }

    const allCriteres = loadCriteres();
    const categoryCriteres = allCriteres.filter(c => c.categoryId === categoryId);
    const critereLimitError = validateCritereLimit(categoryCriteres.length);
    if (critereLimitError) {
      throw new Error(critereLimitError);
    }

    const newCritere = addCritere(categoryId, { nom: critereData.nom });
    
    // Set weight for current metier
    if (metierId) {
      setCritereWeight(metierId, categoryId, newCritere.id, critereData.poids);
    }
    
    loadCategoriesFromStorage();
  }, [metierId, loadCategoriesFromStorage]);

  /**
   * Update a criterion (affects all metiers for name, only current metier for weight)
   */
  const handleUpdateCritere = useCallback((categoryId, critereId, updates, silent = false) => {
    if (updates.poids !== undefined && metierId) {
      const weightError = validateWeight(updates.poids);
      if (weightError) {
        throw new Error(weightError);
      }
      // Update weight for current metier only
      setCritereWeight(metierId, categoryId, critereId, updates.poids);
    }
    
    if (updates.nom !== undefined) {
      // Update name for all metiers
      const updated = updateCritere(critereId, { nom: updates.nom });
      if (!updated) {
        throw new Error('Motivation clé non trouvée');
      }
    }

    loadCategoriesFromStorage();
  }, [metierId, loadCategoriesFromStorage]);

  /**
   * Delete a criterion (affects all metiers)
   */
  const handleDeleteCritere = useCallback((categoryId, critereId) => {
    deleteCritere(critereId);
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
