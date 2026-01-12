/**
 * Utility functions for weight-based color calculation
 */

import { WEIGHT_COLORS, WEIGHT_RANGES } from './constants';

/**
 * Get background color for a criterion based on its weight
 * @param {number} poids - Weight value (1-30)
 * @returns {string} Hex color code
 */
export const getWeightColor = (poids) => {
  if (poids >= WEIGHT_RANGES.DISADVANTAGE.min && poids <= WEIGHT_RANGES.DISADVANTAGE.max) {
    return WEIGHT_COLORS.DISADVANTAGE;
  }
  if (poids >= WEIGHT_RANGES.SMALL_DISADVANTAGE.min && poids <= WEIGHT_RANGES.SMALL_DISADVANTAGE.max) {
    return WEIGHT_COLORS.SMALL_DISADVANTAGE;
  }
  if (poids >= WEIGHT_RANGES.NSP.min && poids <= WEIGHT_RANGES.NSP.max) {
    return WEIGHT_COLORS.NSP;
  }
  if (poids >= WEIGHT_RANGES.SMALL_ADVANTAGE.min && poids <= WEIGHT_RANGES.SMALL_ADVANTAGE.max) {
    return WEIGHT_COLORS.SMALL_ADVANTAGE;
  }
  return WEIGHT_COLORS.ADVANTAGE;
};
