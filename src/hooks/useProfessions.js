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
      
      
      setProfessions(loaded);
      
      // Set current profession to first one if available
      if (loaded.length > 0 && !currentProfessionId) {
        setCurrentProfessionId(loaded[0].id);
      }
    } catch (err) {
      console.error('Error loading professions:', err);
      throw new Error('Erreur lors du chargement des métiers');
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
      throw new Error('Le nom du métier est obligatoire');
    }

    if (professions.length >= LIMITS.MAX_METIERS) {
      throw new Error(`Vous ne pouvez pas créer plus de ${LIMITS.MAX_METIERS} métiers`);
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
      throw new Error('Le nom du métier est obligatoire');
    }

    const updated = updateProfession(professionId, updates);
    if (!updated) {
      throw new Error('Métier non trouvé');
    }

    loadProfessionsFromStorage();
  }, [loadProfessionsFromStorage]);

  /**
   * Delete a profession
   * Allows deletion of last profession only if no categories or criteria exist
   */
  const handleDeleteProfession = useCallback((professionId) => {
    if (professions.length === 1) {
      // Last profession - check if there are any categories or criteria
      const categories = loadCategories();
      const criteria = loadCriteria();
      
      if (categories.length > 0 || criteria.length > 0) {
        throw new Error('CANT_DELETE_LAST_PROFESSION_WITH_DATA');
      }
      // If no categories or criteria, allow deletion
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
