import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  getAccessibleTextColor,
  adjustColorForContrast
} from './colorContrast';

describe('Color Contrast Utilities', () => {
  describe('getContrastRatio', () => {
    it('should calculate contrast ratio correctly', () => {
      // Black on white should have high contrast
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeGreaterThan(20);
    });

    it('should return 1 for same colors', () => {
      const ratio = getContrastRatio('#FF0000', '#FF0000');
      expect(ratio).toBe(1);
    });

    it('should handle invalid hex colors', () => {
      const ratio = getContrastRatio('invalid', '#FFFFFF');
      expect(ratio).toBe(1);
    });
  });

  describe('meetsWCAGAA', () => {
    it('should return true for high contrast combinations', () => {
      expect(meetsWCAGAA('#000000', '#FFFFFF')).toBe(true);
    });

    it('should return false for low contrast combinations', () => {
      expect(meetsWCAGAA('#CCCCCC', '#FFFFFF')).toBe(false);
    });

    it('should use lower threshold for large text', () => {
      expect(meetsWCAGAA('#888888', '#FFFFFF', true)).toBe(true);
      expect(meetsWCAGAA('#888888', '#FFFFFF', false)).toBe(false);
    });
  });

  describe('meetsWCAGAAA', () => {
    it('should return true for very high contrast combinations', () => {
      expect(meetsWCAGAAA('#000000', '#FFFFFF')).toBe(true);
    });

    it('should return false for moderate contrast combinations', () => {
      expect(meetsWCAGAAA('#666666', '#FFFFFF')).toBe(false);
    });
  });

  describe('getAccessibleTextColor', () => {
    it('should return white for dark backgrounds', () => {
      expect(getAccessibleTextColor('#000000')).toBe('#FFFFFF');
    });

    it('should return black for light backgrounds', () => {
      expect(getAccessibleTextColor('#FFFFFF')).toBe('#000000');
    });
  });
});
