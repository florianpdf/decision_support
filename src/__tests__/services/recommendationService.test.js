/**
 * Tests for recommendation service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateProfessionScore,
  calculateConfidenceScore,
  getRecommendation,
  DEFAULT_PREFERENCES
} from '../../services/recommendationService';
import * as storage from '../../services/storage';

// Mock storage
vi.mock('../../services/storage', () => ({
  getCategoriesForProfessions: vi.fn()
}));

describe('recommendationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateProfessionScore', () => {
    it('should return score 0 for profession with no categories', () => {
      storage.getCategoriesForProfessions.mockReturnValue({
        1: []
      });

      const result = calculateProfessionScore(1, DEFAULT_PREFERENCES, { 1: [] });

      expect(result.totalScore).toBe(0);
      expect(result.categoryScores).toHaveLength(0);
    });

    it('should ignore categories without criteria', () => {
      const categories = [
        {
          id: 1,
          name: 'Avec critères',
          criteria: [
            { id: 1, name: 'A1', weight: 20, type: 'advantage' }
          ]
        },
        {
          id: 2,
          name: 'Sans critères',
          criteria: []
        }
      ];

      const result = calculateProfessionScore(1, DEFAULT_PREFERENCES, { 1: categories });

      expect(result.categoryScores).toHaveLength(1);
      expect(result.categoryScores[0].categoryName).toBe('Avec critères');
    });

    it('should apply multiplier 1.5 for category with majority advantages (≥50%)', () => {
      const categories = [
        {
          id: 1,
          name: 'Avantages',
          criteria: [
            { id: 1, name: 'A1', weight: 60, type: 'advantage' }, // 60% of 100
            { id: 2, name: 'A2', weight: 30, type: 'small_advantage' }, // 30% of 100
            { id: 3, name: 'D1', weight: 10, type: 'disadvantage' } // 10% of 100
          ]
        }
      ];

      const result = calculateProfessionScore(1, DEFAULT_PREFERENCES, { 1: categories });

      // Total weight = 100
      // Advantage percent = (60 + 30) / 100 = 90% ≥ 50%
      // Multiplier = 1.5
      // Score = 100 * 1.5 = 150
      expect(result.totalScore).toBe(150);
    });

    it('should apply multiplier 0.5 for category with majority disadvantages (≥50%)', () => {
      const categories = [
        {
          id: 1,
          name: 'Désavantages',
          criteria: [
            { id: 1, name: 'D1', weight: 60, type: 'disadvantage' }, // 60% of 100
            { id: 2, name: 'SD1', weight: 30, type: 'small_disadvantage' }, // 30% of 100
            { id: 3, name: 'A1', weight: 10, type: 'advantage' } // 10% of 100
          ]
        }
      ];

      const result = calculateProfessionScore(1, DEFAULT_PREFERENCES, { 1: categories });

      // Total weight = 100
      // Disadvantage percent = (60 + 30) / 100 = 90% ≥ 50%
      // Multiplier = 0.5
      // Score = 100 * 0.5 = 50
      expect(result.totalScore).toBe(50);
    });

    it('should apply multiplier 1.0 for category with majority NSP (≥50%)', () => {
      const categories = [
        {
          id: 1,
          name: 'NSP',
          criteria: [
            { id: 1, name: 'N1', weight: 60, type: 'neutral' }, // 60% of 100
            { id: 2, name: 'A1', weight: 20, type: 'advantage' }, // 20% of 100
            { id: 3, name: 'D1', weight: 20, type: 'disadvantage' } // 20% of 100
          ]
        }
      ];

      const result = calculateProfessionScore(1, DEFAULT_PREFERENCES, { 1: categories });

      // Total weight = 100
      // Neutral percent = 60 / 100 = 60% ≥ 50%
      // Multiplier = 1.0
      // Score = 100 * 1.0 = 100
      expect(result.totalScore).toBe(100);
    });

    it('should apply multiplier 1.0 for balanced category (no majority ≥50%)', () => {
      const categories = [
        {
          id: 1,
          name: 'Équilibré',
          criteria: [
            { id: 1, name: 'A1', weight: 40, type: 'advantage' }, // 40% of 100
            { id: 2, name: 'D1', weight: 40, type: 'disadvantage' }, // 40% of 100
            { id: 3, name: 'N1', weight: 20, type: 'neutral' } // 20% of 100
          ]
        }
      ];

      const result = calculateProfessionScore(1, DEFAULT_PREFERENCES, { 1: categories });

      // Total weight = 100
      // No majority (all < 50%)
      // Multiplier = 1.0
      // Score = 100 * 1.0 = 100
      expect(result.totalScore).toBe(100);
    });

    it('should apply priority multiplier correctly (5 stars = 2.0)', () => {
      const categories = [
        {
          id: 1,
          name: 'Prioritaire',
          criteria: [
            { id: 1, name: 'A1', weight: 50, type: 'advantage' }
          ]
        }
      ];

      const preferences = {
        ...DEFAULT_PREFERENCES,
        priorityCategories: { 1: 5 } // 5 stars
      };

      const result = calculateProfessionScore(1, preferences, { 1: categories });

      // Total weight = 50
      // Advantage percent = 100% ≥ 50%
      // Type multiplier = 1.5
      // Priority multiplier = 2.0 (5 stars)
      // Score = 50 * 1.5 * 2.0 = 150
      expect(result.totalScore).toBe(150);
    });

    it('should apply priority multipliers correctly for all levels', () => {
      const categories = [
        {
          id: 1,
          name: 'Cat1',
          criteria: [
            { id: 1, name: 'A1', weight: 50, type: 'advantage' }
          ]
        }
      ];

      // Test all priority levels
      const priorities = [
        { level: 5, expectedMultiplier: 2.0 },
        { level: 4, expectedMultiplier: 1.5 },
        { level: 3, expectedMultiplier: 1.0 },
        { level: 2, expectedMultiplier: 0.5 },
        { level: 1, expectedMultiplier: 0.2 }
      ];

      priorities.forEach(({ level, expectedMultiplier }) => {
        const preferences = {
          ...DEFAULT_PREFERENCES,
          priorityCategories: { 1: level }
        };

        const result = calculateProfessionScore(1, preferences, { 1: categories });

        // Base: 50 * 1.5 (advantage) = 75
        // With priority: 75 * expectedMultiplier
        const expectedScore = 75 * expectedMultiplier;
        expect(result.totalScore).toBe(expectedScore);
      });
    });

    it('should calculate score for multiple categories', () => {
      const categories = [
        {
          id: 1,
          name: 'Avantages',
          criteria: [
            { id: 1, name: 'A1', weight: 50, type: 'advantage' }
          ]
        },
        {
          id: 2,
          name: 'Désavantages',
          criteria: [
            { id: 2, name: 'D1', weight: 30, type: 'disadvantage' }
          ]
        }
      ];

      const result = calculateProfessionScore(1, DEFAULT_PREFERENCES, { 1: categories });

      // Category 1: 50 * 1.5 = 75
      // Category 2: 30 * 0.5 = 15
      // Total = 75 + 15 = 90
      expect(result.totalScore).toBe(90);
      expect(result.categoryScores).toHaveLength(2);
    });
  });

  describe('calculateConfidenceScore', () => {
    it('should return 100% confidence for single profession', () => {
      const scores = [
        { professionId: 1, totalScore: 100 }
      ];

      const result = calculateConfidenceScore(scores);

      expect(result.percentage).toBe(100);
      expect(result.label).toBe('Très fiable');
    });

    it('should calculate confidence correctly based on score difference', () => {
      const scores = [
        { professionId: 1, totalScore: 100 },
        { professionId: 2, totalScore: 50 }
      ];

      const result = calculateConfidenceScore(scores);

      // Difference = 100 - 50 = 50
      // Percentage = (50 / 100) * 100 = 50%
      expect(result.percentage).toBe(50);
      expect(result.label).toBe('Moyennement fiable');
    });

    it('should return correct labels for different confidence levels', () => {
      const testCases = [
        { max: 100, second: 10, expectedLabel: 'Très fiable', expectedPercent: 90 }, // ≥80%
        { max: 100, second: 35, expectedLabel: 'Fiable', expectedPercent: 65 }, // ≥60%
        { max: 100, second: 55, expectedLabel: 'Moyennement fiable', expectedPercent: 45 }, // ≥40%
        { max: 100, second: 80, expectedLabel: 'Peu fiable', expectedPercent: 20 } // <40%
      ];

      testCases.forEach(({ max, second, expectedLabel, expectedPercent }) => {
        const scores = [
          { professionId: 1, totalScore: max },
          { professionId: 2, totalScore: second }
        ];

        const result = calculateConfidenceScore(scores);

        expect(result.label).toBe(expectedLabel);
        expect(result.percentage).toBe(expectedPercent);
      });
    });

    it('should handle zero scores correctly', () => {
      const scores = [
        { professionId: 1, totalScore: 0 },
        { professionId: 2, totalScore: 0 }
      ];

      const result = calculateConfidenceScore(scores);

      expect(result.percentage).toBe(0);
      expect(result.label).toBe('Non fiable');
    });

    it('should handle multiple professions and use second highest', () => {
      const scores = [
        { professionId: 1, totalScore: 100 },
        { professionId: 2, totalScore: 80 },
        { professionId: 3, totalScore: 50 }
      ];

      const result = calculateConfidenceScore(scores);

      // Should compare with second (80), not third (50)
      // Difference = 100 - 80 = 20
      // Percentage = (20 / 100) * 100 = 20%
      expect(result.percentage).toBe(20);
      expect(result.label).toBe('Peu fiable');
    });
  });

  describe('getRecommendation', () => {
    it('should return null for empty professionIds', () => {
      const result = getRecommendation([]);
      expect(result).toBeNull();
    });

    it('should return recommendation with highest score', () => {
      const categoriesData = {
        1: [
          {
            id: 1,
            name: 'Avantages',
            criteria: [
              { id: 1, name: 'A1', weight: 100, type: 'advantage' }
            ]
          }
        ],
        2: [
          {
            id: 1,
            name: 'Désavantages',
            criteria: [
              { id: 1, name: 'D1', weight: 100, type: 'disadvantage' }
            ]
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(categoriesData);

      const result = getRecommendation([1, 2]);

      // Profession 1: 100 * 1.5 = 150
      // Profession 2: 100 * 0.5 = 50
      // Should recommend profession 1
      expect(result.recommendedProfessionId).toBe(1);
      expect(result.recommendedScore).toBe(150);
      expect(result.allScores).toHaveLength(2);
      expect(result.allScores[0].professionId).toBe(1);
      expect(result.allScores[1].professionId).toBe(2);
    });

    it('should use default preferences when not provided', () => {
      const categoriesData = {
        1: [
          {
            id: 1,
            name: 'Test',
            criteria: [
              { id: 1, name: 'A1', weight: 50, type: 'advantage' }
            ]
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(categoriesData);

      const result = getRecommendation([1]);

      expect(result.preferences).toEqual(DEFAULT_PREFERENCES);
    });

    it('should merge provided preferences with defaults', () => {
      const categoriesData = {
        1: [
          {
            id: 1,
            name: 'Test',
            criteria: [
              { id: 1, name: 'A1', weight: 50, type: 'advantage' }
            ]
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(categoriesData);

      const customPreferences = {
        priorityCategories: { 1: 5 }
      };

      const result = getRecommendation([1], customPreferences);

      expect(result.preferences.priorityCategories).toEqual({ 1: 5 });
      expect(result.preferences.advantageWeight).toBe(DEFAULT_PREFERENCES.advantageWeight);
    });

    it('should include explanation with points and warnings', () => {
      const categoriesData = {
        1: [
          {
            id: 1,
            name: 'Top1',
            criteria: [
              { id: 1, name: 'A1', weight: 100, type: 'advantage' }
            ]
          },
          {
            id: 2,
            name: 'Top2',
            criteria: [
              { id: 2, name: 'A2', weight: 80, type: 'advantage' }
            ]
          },
          {
            id: 3,
            name: 'Top3',
            criteria: [
              { id: 3, name: 'A3', weight: 60, type: 'advantage' }
            ]
          }
        ],
        2: [
          {
            id: 1,
            name: 'Test',
            criteria: [
              { id: 1, name: 'A1', weight: 50, type: 'advantage' }
            ]
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(categoriesData);

      const result = getRecommendation([1, 2]);

      expect(result.explanation).toHaveProperty('points');
      expect(result.explanation).toHaveProperty('warnings');
      expect(result.explanation.points.length).toBeGreaterThan(0);
    });

    it('should include warning when confidence is low', () => {
      const categoriesData = {
        1: [
          {
            id: 1,
            name: 'Test',
            criteria: [
              { id: 1, name: 'A1', weight: 100, type: 'advantage' }
            ]
          }
        ],
        2: [
          {
            id: 1,
            name: 'Test',
            criteria: [
              { id: 1, name: 'A1', weight: 95, type: 'advantage' } // Very close
            ]
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(categoriesData);

      const result = getRecommendation([1, 2]);

      // Confidence should be low (< 40%)
      if (result.confidence.percentage < 40) {
        expect(result.explanation.warnings.length).toBeGreaterThan(0);
        expect(result.explanation.warnings[0]).toContain('peu fiable');
      }
    });

    it('should calculate confidence correctly', () => {
      const categoriesData = {
        1: [
          {
            id: 1,
            name: 'Test',
            criteria: [
              { id: 1, name: 'A1', weight: 100, type: 'advantage' }
            ]
          }
        ],
        2: [
          {
            id: 1,
            name: 'Test',
            criteria: [
              { id: 1, name: 'A1', weight: 50, type: 'advantage' }
            ]
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(categoriesData);

      const result = getRecommendation([1, 2]);

      expect(result.confidence).toHaveProperty('percentage');
      expect(result.confidence).toHaveProperty('label');
      expect(result.confidence.percentage).toBeGreaterThanOrEqual(0);
      expect(result.confidence.percentage).toBeLessThanOrEqual(100);
    });
  });
});
