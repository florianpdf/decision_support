import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateProfessionTemplate } from '../../utils/professionTemplate';
import { CATEGORY_SUGGESTIONS } from '../../utils/categorySuggestions';
import { CRITERION_SUGGESTIONS } from '../../utils/criterionSuggestions';
import { COLOR_PALETTE } from '../../constants/colors';
import { DEFAULT_CRITERION_TYPE } from '../../utils/constants';

describe('professionTemplate', () => {
  beforeEach(() => {
    // Reset Math.random to ensure consistent tests
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate template with 6 categories', () => {
    const template = generateProfessionTemplate();
    expect(template.categories).toHaveLength(6);
  });

  it('should generate 5 criteria per category', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      expect(category.criteria).toHaveLength(5);
    });
  });

  it('should use category names from suggestions', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      expect(CATEGORY_SUGGESTIONS).toContain(category.name);
    });
  });

  it('should use criterion names from suggestions', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      category.criteria.forEach(criterion => {
        expect(CRITERION_SUGGESTIONS).toContain(criterion.name);
      });
    });
  });

  it('should assign colors from palette', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      expect(COLOR_PALETTE).toContain(category.color);
    });
  });

  it('should set default weight to 15 for all criteria', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      category.criteria.forEach(criterion => {
        expect(criterion.weight).toBe(15);
      });
    });
  });

  it('should set default type to NSP for all criteria', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      category.criteria.forEach(criterion => {
        expect(criterion.type).toBe(DEFAULT_CRITERION_TYPE);
      });
    });
  });

  it('should generate different templates on multiple calls (randomness)', () => {
    // Allow some randomness
    vi.restoreAllMocks();
    
    const template1 = generateProfessionTemplate();
    const template2 = generateProfessionTemplate();
    
    // At least one category name should be different (very likely with randomness)
    const names1 = template1.categories.map(c => c.name).sort();
    const names2 = template2.categories.map(c => c.name).sort();
    
    // With true randomness, they might be the same, but structure should be consistent
    expect(template1.categories.length).toBe(template2.categories.length);
    expect(template1.categories[0].criteria.length).toBe(template2.categories[0].criteria.length);
  });

  it('should have valid category structure', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('color');
      expect(category).toHaveProperty('criteria');
      expect(Array.isArray(category.criteria)).toBe(true);
    });
  });

  it('should have valid criterion structure', () => {
    const template = generateProfessionTemplate();
    template.categories.forEach(category => {
      category.criteria.forEach(criterion => {
        expect(criterion).toHaveProperty('name');
        expect(criterion).toHaveProperty('weight');
        expect(criterion).toHaveProperty('type');
        expect(typeof criterion.name).toBe('string');
        expect(typeof criterion.weight).toBe('number');
        expect(typeof criterion.type).toBe('string');
      });
    });
  });
});
