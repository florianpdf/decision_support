/**
 * Custom hook for managing metiers
 */

import { useState, useEffect, useCallback } from 'react';
import {
  loadMetiers,
  saveMetiers,
  addMetier,
  updateMetier,
  deleteMetier,
  initializeMetierWeights,
  getCategoriesForMetier
} from '../services/storage';
import { LIMITS } from '../utils/constants';

/**
 * Hook for managing metiers
 * @returns {Object} Metiers state and handlers
 */
export const useMetiers = () => {
  const [metiers, setMetiers] = useState([]);
  const [currentMetierId, setCurrentMetierId] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load metiers from storage
   */
  const loadMetiersFromStorage = useCallback(() => {
    try {
      setLoading(true);
      const loaded = loadMetiers();
      setMetiers(loaded);
      
      // Set current metier to first one if available
      if (loaded.length > 0 && !currentMetierId) {
        setCurrentMetierId(loaded[0].id);
      }
    } catch (err) {
      console.error('Error loading metiers:', err);
      throw new Error('Erreur lors du chargement des métiers');
    } finally {
      setLoading(false);
    }
  }, [currentMetierId]);

  // Load metiers on mount
  useEffect(() => {
    loadMetiersFromStorage();
  }, [loadMetiersFromStorage]);

  /**
   * Add a new metier
   */
  const handleAddMetier = useCallback((metierData) => {
    if (!metierData.nom || !metierData.nom.trim()) {
      throw new Error('Le nom du métier est obligatoire');
    }

    if (metiers.length >= LIMITS.MAX_METIERS) {
      throw new Error(`Vous ne pouvez pas créer plus de ${LIMITS.MAX_METIERS} métiers`);
    }

    const newMetier = addMetier(metierData);
    
    // Initialize weights from last metier if exists
    if (metiers.length > 0) {
      const lastMetierId = metiers[metiers.length - 1].id;
      initializeMetierWeights(newMetier.id, lastMetierId);
    }
    
    setCurrentMetierId(newMetier.id);
    loadMetiersFromStorage();
    
    return newMetier;
  }, [metiers, loadMetiersFromStorage]);

  /**
   * Update a metier
   */
  const handleUpdateMetier = useCallback((metierId, updates) => {
    if (updates.nom !== undefined && !updates.nom.trim()) {
      throw new Error('Le nom du métier est obligatoire');
    }

    const updated = updateMetier(metierId, updates);
    if (!updated) {
      throw new Error('Métier non trouvé');
    }

    loadMetiersFromStorage();
  }, [loadMetiersFromStorage]);

  /**
   * Delete a metier
   */
  const handleDeleteMetier = useCallback((metierId) => {
    if (metiers.length === 1) {
      // Last metier - special handling
      throw new Error('CANT_DELETE_LAST_METIER');
    }

    deleteMetier(metierId);
    
    // If deleted metier was current, switch to first available
    if (currentMetierId === metierId) {
      const remaining = metiers.filter(m => m.id !== metierId);
      if (remaining.length > 0) {
        setCurrentMetierId(remaining[0].id);
      } else {
        setCurrentMetierId(null);
      }
    }
    
    loadMetiersFromStorage();
  }, [metiers, currentMetierId, loadMetiersFromStorage]);

  /**
   * Get current metier
   */
  const currentMetier = metiers.find(m => m.id === currentMetierId);

  /**
   * Get categories for current metier
   */
  const getCurrentMetierCategories = useCallback(() => {
    if (!currentMetierId) {
      return [];
    }
    return getCategoriesForMetier(currentMetierId);
  }, [currentMetierId]);

  return {
    metiers,
    currentMetierId,
    currentMetier,
    loading,
    handleAddMetier,
    handleUpdateMetier,
    handleDeleteMetier,
    setCurrentMetierId,
    getCurrentMetierCategories,
    reloadMetiers: loadMetiersFromStorage
  };
};
