import { describe, it, expect } from 'vitest';
import { COLOR_PALETTE, DEFAULT_COLOR } from '../../constants/colors';

describe('Colors Constants', () => {
  describe('COLOR_PALETTE', () => {
    it('should have exactly 10 colors', () => {
      expect(COLOR_PALETTE).toHaveLength(10);
    });

    it('should contain only valid hex colors', () => {
      COLOR_PALETTE.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have unique colors', () => {
      const uniqueColors = new Set(COLOR_PALETTE);
      expect(uniqueColors.size).toBe(COLOR_PALETTE.length);
    });

    it('should contain expected colors', () => {
      expect(COLOR_PALETTE).toContain('#6BB6FF');
      expect(COLOR_PALETTE).toContain('#66D9A3');
      expect(COLOR_PALETTE).toContain('#FFB366');
    });
  });

  describe('DEFAULT_COLOR', () => {
    it('should be the first color in the palette', () => {
      expect(DEFAULT_COLOR).toBe(COLOR_PALETTE[0]);
    });

    it('should be a valid hex color', () => {
      expect(DEFAULT_COLOR).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
