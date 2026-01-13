/**
 * Custom hook for managing professions
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadProfessions,
  saveProfessions,
  addProfession,
  updateProfession,
  deleteProfession,
  initializeProfessionWeights,
  getCategoriesForProfession,
  loadCategories,
  loadCriteria,
  loadCriterionWeights,
  saveCriterionWeights,
  addProfession as addProfessionStorage
} from '../services/storage';
import { LIMITS } from '../utils/constants';

/**
 * Hook for managing professions
 * @returns {Object} Professions state and handlers
 */
export const useProfessions = () => {
  const [professions, setProfessions] = useState([]);
  const [currentProfessionId, setCurrentProfessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load professions from storage
   */
  const loadProfessionsFromStorage = useCallback(() => {
    try {
      setLoading(true);
      let loaded = loadProfessions();
      
      // If no professions but old data exists, create a default profession
      if (loaded.length === 0) {
        const oldCategories = loadCategories();
        if (oldCategories && oldCategories.length > 0) {
          // Migrate: create default profession for old data
          const defaultProfession = addProfessionStorage({ name: 'Default Profession' });
          loaded = [defaultProfession];
          
          // Initialize weights for all existing criteria
          const allCriteria = loadCriteria();
          const weights = loadCriterionWeights();
          oldCategories.forEach(category => {
            const criterionIds = category.criterionIds || category.critereIds || (category.criteres ? category.criteres.map(c => c.id) : []);
            criterionIds.forEach(criterionId => {
              const criterion = allCriteria.find(c => c.id === criterionId);
              if (criterion) {
                const oldCriterion = category.criteres?.find(c => c.id === criterionId);
                const weight = oldCriterion?.poids || oldCriterion?.weight || 15;
                
                // Check if weight already exists
                const existingWeight = weights.find(
                  w => w.professionId === defaultProfession.id && w.criterionId === criterionId
                );
                if (!existingWeight) {
                  weights.push({
                    professionId: defaultProfession.id,
                    categoryId: category.id,
                    criterionId: criterionId,
                    weight: weight,
                  });
                }
              }
            });
          });
          saveCriterionWeights(weights);
        }
      }
      
      setProfessions(loaded);
      
      // Set current profession to first one if available
      if (loaded.length > 0 && !currentProfessionId) {
        setCurrentProfessionId(loaded[0].id);
      }
    } catch (err) {
      console.error('Error loading professions:', err);
      throw new Error('Error loading professions');
    } finally {
      setLoading(false);
    }
  }, [currentProfessionId]);

  // Load professions on mount
  useEffect(() => {
    loadProfessionsFromStorage();
  }, [loadProfessionsFromStorage]);

  /**
   * Add a new profession
   */
  const handleAddProfession = useCallback((professionData) => {
    if (!professionData.name || !professionData.name.trim()) {
      throw new Error('Profession name is required');
    }

    if (professions.length >= LIMITS.MAX_METIERS) {
      throw new Error(`You cannot create more than ${LIMITS.MAX_METIERS} professions`);
    }

    const newProfession = addProfession(professionData);
    
    // Initialize weights from last profession if exists
    if (professions.length > 0) {
      const lastProfessionId = professions[professions.length - 1].id;
      initializeProfessionWeights(newProfession.id, lastProfessionId);
    }
    
    setCurrentProfessionId(newProfession.id);
    loadProfessionsFromStorage();
    
    return newProfession;
  }, [professions, loadProfessionsFromStorage]);

  /**
   * Update a profession
   */
  const handleUpdateProfession = useCallback((professionId, updates) => {
    if (updates.name !== undefined && !updates.name.trim()) {
      throw new Error('Profession name is required');
    }

    const updated = updateProfession(professionId, updates);
    if (!updated) {
      throw new Error('Profession not found');
    }

    loadProfessionsFromStorage();
  }, [loadProfessionsFromStorage]);

  /**
   * Delete a profession
   */
  const handleDeleteProfession = useCallback((professionId) => {
    if (professions.length === 1) {
      // Last profession - special handling
      throw new Error('CANT_DELETE_LAST_PROFESSION');
    }

    deleteProfession(professionId);
    
    // If deleted profession was current, switch to first available
    if (currentProfessionId === professionId) {
      const remaining = professions.filter(p => p.id !== professionId);
      if (remaining.length > 0) {
        setCurrentProfessionId(remaining[0].id);
      } else {
        setCurrentProfessionId(null);
      }
    }
    
    loadProfessionsFromStorage();
  }, [professions, currentProfessionId, loadProfessionsFromStorage]);

  /**
   * Get current profession
   */
  const currentProfession = professions.find(p => p.id === currentProfessionId);

  /**
   * Get categories for current profession
   */
  const getCurrentProfessionCategories = useCallback(() => {
    if (!currentProfessionId) {
      return [];
    }
    return getCategoriesForProfession(currentProfessionId);
  }, [currentProfessionId]);

  return {
    professions,
    currentProfessionId,
    currentProfession,
    loading,
    handleAddProfession,
    handleUpdateProfession,
    handleDeleteProfession,
    setCurrentProfessionId,
    getCurrentProfessionCategories,
    reloadProfessions: loadProfessionsFromStorage
  };
};
