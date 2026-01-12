/**
 * Utility functions for color contrast calculation and WCAG compliance
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (e.g., "#FF0000")
 * @returns {Object} RGB values {r, g, b}
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate relative luminance of a color
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {number} Relative luminance (0-1)
 */
const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {boolean} largeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns {boolean} True if meets WCAG AA
 */
export const meetsWCAGAA = (foreground, background, largeText = false) => {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Check if contrast meets WCAG AAA standard (7:1 for normal text, 4.5:1 for large text)
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {boolean} largeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns {boolean} True if meets WCAG AAA
 */
export const meetsWCAGAAA = (foreground, background, largeText = false) => {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Find accessible text color for a given background
 * @param {string} background - Background color (hex)
 * @returns {string} Accessible text color (#000000 or #FFFFFF)
 */
export const getAccessibleTextColor = (background) => {
  const whiteContrast = getContrastRatio('#FFFFFF', background);
  const blackContrast = getContrastRatio('#000000', background);
  
  // Prefer white if both meet minimum, otherwise choose the better one
  if (whiteContrast >= 4.5 && blackContrast >= 4.5) {
    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
  }
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
};

/**
 * Adjust color brightness to meet contrast requirements
 * @param {string} color - Color to adjust (hex)
 * @param {string} background - Background color (hex)
 * @param {number} targetRatio - Target contrast ratio
 * @param {boolean} darken - Whether to darken (true) or lighten (false)
 * @returns {string} Adjusted color (hex)
 */
export const adjustColorForContrast = (color, background, targetRatio = 4.5, darken = true) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  let adjusted = { ...rgb };
  const currentRatio = getContrastRatio(color, background);
  
  if (currentRatio >= targetRatio) return color;
  
  // Simple adjustment - darken or lighten
  const step = darken ? -10 : 10;
  let iterations = 0;
  const maxIterations = 20;
  
  while (iterations < maxIterations) {
    adjusted.r = Math.max(0, Math.min(255, adjusted.r + step));
    adjusted.g = Math.max(0, Math.min(255, adjusted.g + step));
    adjusted.b = Math.max(0, Math.min(255, adjusted.b + step));
    
    const newColor = `#${[adjusted.r, adjusted.g, adjusted.b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')}`;
    
    if (getContrastRatio(newColor, background) >= targetRatio) {
      return newColor;
    }
    
    iterations++;
  }
  
  return color;
};
