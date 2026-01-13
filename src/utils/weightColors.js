/**
 * Utility functions for weight-based color calculation
 */

import { WEIGHT_COLORS, WEIGHT_RANGES } from './constants';

/**
 * Get background color for a criterion based on its weight
 * @param {number} weight - Weight value (1-30)
 * @returns {string} Hex color code
 */
export const getWeightColor = (weight) => {
  if (weight >= WEIGHT_RANGES.DISADVANTAGE.min && weight <= WEIGHT_RANGES.DISADVANTAGE.max) {
    return WEIGHT_COLORS.DISADVANTAGE;
  }
  if (weight >= WEIGHT_RANGES.SMALL_DISADVANTAGE.min && weight <= WEIGHT_RANGES.SMALL_DISADVANTAGE.max) {
    return WEIGHT_COLORS.SMALL_DISADVANTAGE;
  }
  if (weight >= WEIGHT_RANGES.NSP.min && weight <= WEIGHT_RANGES.NSP.max) {
    return WEIGHT_COLORS.NSP;
  }
  if (weight >= WEIGHT_RANGES.SMALL_ADVANTAGE.min && weight <= WEIGHT_RANGES.SMALL_ADVANTAGE.max) {
    return WEIGHT_COLORS.SMALL_ADVANTAGE;
  }
  return WEIGHT_COLORS.ADVANTAGE;
};
