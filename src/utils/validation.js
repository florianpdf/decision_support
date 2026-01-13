/**
 * Validation utility functions
 */

import { LIMITS } from './constants';

/**
 * Validate category name
 * @param {string} name - Category name
 * @returns {string|null} Error message or null if valid
 */
export const validateCategoryName = (name) => {
  if (!name || !name.trim()) {
    return 'Veuillez saisir un nom pour l\'intérêt professionnel';
  }
  return null;
};

/**
 * Validate criterion name
 * @param {string} name - Criterion name
 * @returns {string|null} Error message or null if valid
 */
export const validateCriterionName = (name) => {
  if (!name || !name.trim()) {
    return 'Veuillez saisir un nom pour la motivation clé';
  }
  return null;
};


/**
 * Validate weight value
 * @param {number} weight - Weight value
 * @returns {string|null} Error message or null if valid
 */
export const validateWeight = (weight) => {
  const weightNum = parseFloat(weight);
  if (isNaN(weightNum) || weightNum < LIMITS.MIN_WEIGHT || weightNum > LIMITS.MAX_WEIGHT) {
    return `L'importance doit être entre ${LIMITS.MIN_WEIGHT} et ${LIMITS.MAX_WEIGHT}`;
  }
  return null;
};

/**
 * Validate category count limit
 * @param {number} currentCount - Current number of categories
 * @returns {string|null} Error message or null if valid
 */
export const validateCategoryLimit = (currentCount) => {
  if (currentCount >= LIMITS.MAX_CATEGORIES) {
    return `Vous ne pouvez pas ajouter plus de ${LIMITS.MAX_CATEGORIES} intérêts professionnels`;
  }
  return null;
};

/**
 * Validate criterion count limit
 * @param {number} currentCount - Current number of criteria in category
 * @returns {string|null} Error message or null if valid
 */
export const validateCriterionLimit = (currentCount) => {
  if (currentCount >= LIMITS.MAX_CRITERES_PER_CATEGORY) {
    return `Vous ne pouvez pas ajouter plus de ${LIMITS.MAX_CRITERES_PER_CATEGORY} motivations clés par intérêt professionnel`;
  }
  return null;
};

/**
 * Check if color is already used by another category
 * @param {string} color - Color to check
 * @param {Array} categories - List of categories
 * @param {number} excludeId - Category ID to exclude from check
 * @returns {boolean} True if color is already used
 */
export const isColorUsed = (color, categories, excludeId = null) => {
  return categories.some(cat => {
    return cat.id !== excludeId && cat.color === color;
  });
};
