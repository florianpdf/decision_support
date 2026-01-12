/**
 * Accessibility utilities for color contrast validation
 * 
 * This module provides utilities to ensure WCAG AA compliance
 * for all color combinations used in the application.
 */

import { getContrastRatio, meetsWCAGAA } from './colorContrast';

/**
 * Validate all color combinations used in the application
 * @returns {Object} Validation results
 */
export const validateAccessibility = () => {
  const results = {
    weightColors: {},
    textColors: {},
    header: {},
    messages: {},
    allPass: true
  };

  // Import weight colors
  import('../../utils/constants.js').then(({ WEIGHT_COLORS }) => {
    // Validate weight colors with white text
    Object.entries(WEIGHT_COLORS).forEach(([name, color]) => {
      const ratio = getContrastRatio('#FFFFFF', color);
      const passes = meetsWCAGAA('#FFFFFF', color);
      results.weightColors[name] = { ratio, passes, color };
      if (!passes) results.allPass = false;
    });
  });

  // Validate text colors on white background
  const textColors = {
    main: '#333333',
    light: '#5a6268',
    lighter: '#6c757d',
    heading: '#2c3e50'
  };

  Object.entries(textColors).forEach(([name, color]) => {
    const ratio = getContrastRatio(color, '#FFFFFF');
    const passes = meetsWCAGAA(color, '#FFFFFF');
    results.textColors[name] = { ratio, passes, color };
    if (!passes) results.allPass = false;
  });

  // Validate header
  const headerBg = '#5568d3';
  const headerRatio = getContrastRatio('#FFFFFF', headerBg);
  const headerPasses = meetsWCAGAA('#FFFFFF', headerBg);
  results.header = { ratio: headerRatio, passes: headerPasses, bg: headerBg };
  if (!headerPasses) results.allPass = false;

  // Validate messages
  const successRatio = getContrastRatio('#0c5460', '#84fab0');
  const errorRatio = getContrastRatio('#721c24', '#ffecd2');
  results.messages = {
    success: { ratio: successRatio, passes: meetsWCAGAA('#0c5460', '#84fab0') },
    error: { ratio: errorRatio, passes: meetsWCAGAA('#721c24', '#ffecd2') }
  };

  return results;
};

/**
 * Get accessible text color for a background
 * @param {string} backgroundColor - Background color (hex)
 * @returns {string} Accessible text color (#000000 or #FFFFFF)
 */
export const getAccessibleTextColorForBackground = (backgroundColor) => {
  const whiteRatio = getContrastRatio('#FFFFFF', backgroundColor);
  const blackRatio = getContrastRatio('#000000', backgroundColor);
  
  // Prefer the one with better contrast, but ensure it meets WCAG AA
  if (whiteRatio >= 4.5 && blackRatio >= 4.5) {
    return whiteRatio > blackRatio ? '#FFFFFF' : '#000000';
  }
  if (whiteRatio >= 4.5) return '#FFFFFF';
  if (blackRatio >= 4.5) return '#000000';
  
  // If neither meets AA, return the better one (shouldn't happen in production)
  return whiteRatio > blackRatio ? '#FFFFFF' : '#000000';
};
