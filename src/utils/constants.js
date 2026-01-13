/**
 * Application constants
 */

export const LIMITS = {
  MAX_METIERS: 5,
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

// Criterion types for advantage/disadvantage classification
export const CRITERION_TYPES = {
  ADVANTAGE: 'advantage',
  SMALL_ADVANTAGE: 'small_advantage',
  NEUTRAL: 'neutral', // NSP
  SMALL_DISADVANTAGE: 'small_disadvantage',
  DISADVANTAGE: 'disadvantage'
};

// Default criterion type
export const DEFAULT_CRITERION_TYPE = CRITERION_TYPES.NEUTRAL;

// Colors for criterion types (advantage/disadvantage)
export const CRITERION_TYPE_COLORS = {
  [CRITERION_TYPES.ADVANTAGE]: '#2e7d32',           // Dark green
  [CRITERION_TYPES.SMALL_ADVANTAGE]: '#66bb6a',    // Light green
  [CRITERION_TYPES.NEUTRAL]: '#ff9800',            // Orange (NSP)
  [CRITERION_TYPES.SMALL_DISADVANTAGE]: '#ef5350', // Light red
  [CRITERION_TYPES.DISADVANTAGE]: '#c62828'        // Dark red
};

// Labels for criterion types (French UI)
export const CRITERION_TYPE_LABELS = {
  [CRITERION_TYPES.ADVANTAGE]: 'Avantage',
  [CRITERION_TYPES.SMALL_ADVANTAGE]: 'Petit avantage',
  [CRITERION_TYPES.NEUTRAL]: 'NSP',
  [CRITERION_TYPES.SMALL_DISADVANTAGE]: 'Petit désavantage',
  [CRITERION_TYPES.DISADVANTAGE]: 'Désavantage'
};
