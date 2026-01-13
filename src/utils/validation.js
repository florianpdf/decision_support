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
    return 'Please enter a name for the professional interest';
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
    return 'Please enter a name for the key motivation';
  }
  return null;
};

// Legacy function for backward compatibility
export const validateCritereName = validateCriterionName;

/**
 * Validate weight value
 * @param {number} weight - Weight value
 * @returns {string|null} Error message or null if valid
 */
export const validateWeight = (weight) => {
  const weightNum = parseFloat(weight);
  if (isNaN(weightNum) || weightNum < LIMITS.MIN_WEIGHT || weightNum > LIMITS.MAX_WEIGHT) {
    return `Importance must be between ${LIMITS.MIN_WEIGHT} and ${LIMITS.MAX_WEIGHT}`;
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
    return `You cannot add more than ${LIMITS.MAX_CATEGORIES} professional interests`;
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
    return `You cannot add more than ${LIMITS.MAX_CRITERES_PER_CATEGORY} key motivations per professional interest`;
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
    const catColor = cat.color || cat.couleur;
    return cat.id !== excludeId && catColor === color;
  });
};
