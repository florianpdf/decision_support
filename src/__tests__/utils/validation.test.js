import { describe, it, expect } from 'vitest';
import {
  validateCategoryName,
  validateCriterionName,
  validateWeight,
  validateCategoryLimit,
  validateCriterionLimit,
  isColorUsed
} from '../../utils/validation';
import { LIMITS } from '../../utils/constants';

describe('validation', () => {
  describe('validateCategoryName', () => {
    it('should return error for empty name', () => {
      expect(validateCategoryName('')).toBeTruthy();
      expect(validateCategoryName('   ')).toBeTruthy();
      expect(validateCategoryName(null)).toBeTruthy();
      expect(validateCategoryName(undefined)).toBeTruthy();
    });

    it('should return null for valid name', () => {
      expect(validateCategoryName('Valid Category')).toBeNull();
      expect(validateCategoryName('  Valid Category  ')).toBeNull();
    });
  });

  describe('validateCriterionName', () => {
    it('should return error for empty name', () => {
      expect(validateCriterionName('')).toBeTruthy();
      expect(validateCriterionName('   ')).toBeTruthy();
      expect(validateCriterionName(null)).toBeTruthy();
      expect(validateCriterionName(undefined)).toBeTruthy();
    });

    it('should return null for valid name', () => {
      expect(validateCriterionName('Valid Criterion')).toBeNull();
      expect(validateCriterionName('  Valid Criterion  ')).toBeNull();
    });
  });

  describe('validateWeight', () => {
    it('should return error for weight below minimum', () => {
      expect(validateWeight(0)).toBeTruthy();
      expect(validateWeight(-1)).toBeTruthy();
      expect(validateWeight(LIMITS.MIN_WEIGHT - 1)).toBeTruthy();
    });

    it('should return error for weight above maximum', () => {
      expect(validateWeight(LIMITS.MAX_WEIGHT + 1)).toBeTruthy();
      expect(validateWeight(100)).toBeTruthy();
    });

    it('should return error for invalid values', () => {
      expect(validateWeight(NaN)).toBeTruthy();
      expect(validateWeight('invalid')).toBeTruthy();
      expect(validateWeight(null)).toBeTruthy();
      expect(validateWeight(undefined)).toBeTruthy();
    });

    it('should return null for valid weights', () => {
      expect(validateWeight(LIMITS.MIN_WEIGHT)).toBeNull();
      expect(validateWeight(LIMITS.MAX_WEIGHT)).toBeNull();
      expect(validateWeight(15)).toBeNull();
      expect(validateWeight('15')).toBeNull(); // String numbers should work
    });
  });

  describe('validateCategoryLimit', () => {
    it('should return error when limit is reached', () => {
      expect(validateCategoryLimit(LIMITS.MAX_CATEGORIES)).toBeTruthy();
      expect(validateCategoryLimit(LIMITS.MAX_CATEGORIES + 1)).toBeTruthy();
    });

    it('should return null when under limit', () => {
      expect(validateCategoryLimit(0)).toBeNull();
      expect(validateCategoryLimit(LIMITS.MAX_CATEGORIES - 1)).toBeNull();
    });
  });

  describe('validateCriterionLimit', () => {
    it('should return error when limit is reached', () => {
      expect(validateCriterionLimit(LIMITS.MAX_CRITERES_PER_CATEGORY)).toBeTruthy();
      expect(validateCriterionLimit(LIMITS.MAX_CRITERES_PER_CATEGORY + 1)).toBeTruthy();
    });

    it('should return null when under limit', () => {
      expect(validateCriterionLimit(0)).toBeNull();
      expect(validateCriterionLimit(LIMITS.MAX_CRITERES_PER_CATEGORY - 1)).toBeNull();
    });
  });

  describe('isColorUsed', () => {
    const categories = [
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] },
      { id: 2, name: 'Category 2', color: '#00FF00', criteria: [] },
      { id: 3, name: 'Category 3', color: '#0000FF', criteria: [] }
    ];

    it('should return true if color is used', () => {
      expect(isColorUsed('#FF0000', categories)).toBe(true);
      expect(isColorUsed('#00FF00', categories)).toBe(true);
    });

    it('should return false if color is not used', () => {
      expect(isColorUsed('#FFFFFF', categories)).toBe(false);
      expect(isColorUsed('#000000', categories)).toBe(false);
    });

    it('should exclude category by ID when checking', () => {
      expect(isColorUsed('#FF0000', categories, 1)).toBe(false);
      expect(isColorUsed('#FF0000', categories, 2)).toBe(true);
    });

    it('should handle empty categories array', () => {
      expect(isColorUsed('#FF0000', [])).toBe(false);
    });
  });
});
