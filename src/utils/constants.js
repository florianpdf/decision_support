/**
 * Application constants
 */

export const LIMITS = {
  MAX_CATEGORIES: 10,
  MAX_CRITERES_PER_CATEGORY: 110,
  MIN_WEIGHT: 1,
  MAX_WEIGHT: 30
};

export const NOTIFICATION_DURATION = 3000;

export const WEIGHT_COLORS = {
  ADVANTAGE: '#1e6b47',        // 1-6: Dark green (WCAG AA compliant: 6.46:1 with white)
  SMALL_ADVANTAGE: '#2d8659',  // 7-12: Medium green (WCAG AA compliant: 4.50:1 with white)
  NSP: '#b85d0a',              // 13-18: Dark orange (WCAG AA compliant: 4.52:1 with white)
  SMALL_DISADVANTAGE: '#b84c6b', // 19-24: Medium red (WCAG AA compliant: 4.90:1 with white)
  DISADVANTAGE: '#b71c1c'      // 25-30: Dark red (WCAG AA compliant: 6.57:1 with white)
};

export const WEIGHT_RANGES = {
  ADVANTAGE: { min: 1, max: 6 },
  SMALL_ADVANTAGE: { min: 7, max: 12 },
  NSP: { min: 13, max: 18 },
  SMALL_DISADVANTAGE: { min: 19, max: 24 },
  DISADVANTAGE: { min: 25, max: 30 }
};
