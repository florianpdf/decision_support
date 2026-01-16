/**
 * Tests for comparison utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateProfessionMetrics, calculateProfessionsMetrics } from '../../utils/comparisonUtils';
import * as storage from '../../services/storage';

// Mock storage
vi.mock('../../services/storage', () => ({
  getCategoriesForProfession: vi.fn(),
  getCategoriesForProfessions: vi.fn()
}));

describe('comparisonUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateProfessionMetrics', () => {
    it('should return null for invalid professionId', () => {
      const result = calculateProfessionMetrics(null);
      expect(result).toBeNull();
    });

    it('should calculate metrics correctly for a profession with categories and criteria', () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Technique',
          color: '#FF0000',
          criteria: [
            { id: 1, name: 'Autonomie', weight: 20, type: 'advantage' },
            { id: 2, name: 'Innovation', weight: 15, type: 'small_advantage' },
            { id: 3, name: 'Complexité', weight: 25, type: 'disadvantage' }
          ]
        },
        {
          id: 2,
          name: 'Relationnel',
          color: '#00FF00',
          criteria: [
            { id: 4, name: 'Équipe', weight: 18, type: 'advantage' }
          ]
        }
      ];

      storage.getCategoriesForProfession.mockReturnValue(mockCategories);

      const result = calculateProfessionMetrics(1);

      expect(result).not.toBeNull();
      expect(result.professionId).toBe(1);
      expect(result.totalWeight).toBe(78); // 20 + 15 + 25 + 18
      expect(result.totalCriteriaCount).toBe(4);
      expect(result.categoriesCount).toBe(2);
      
      // Check type distribution
      expect(result.typeDistribution.advantage).toBe(38); // 20 + 18
      expect(result.typeDistribution.small_advantage).toBe(15);
      expect(result.typeDistribution.disadvantage).toBe(25);
      expect(result.typeDistribution.neutral).toBe(0);
      
      // Check top categories
      expect(result.topCategories).toHaveLength(2);
      expect(result.topCategories[0].name).toBe('Technique');
      expect(result.topCategories[0].weight).toBe(60);
      
      // Check top criteria
      expect(result.topCriteria).toHaveLength(3);
      expect(result.topCriteria[0].weight).toBe(25); // Highest weight
      expect(result.topCriteria[0].name).toBe('Complexité');
    });

    it('should ignore categories without criteria', () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Technique',
          color: '#FF0000',
          criteria: [
            { id: 1, name: 'Autonomie', weight: 20, type: 'advantage' }
          ]
        },
        {
          id: 2,
          name: 'Vide',
          color: '#00FF00',
          criteria: []
        },
        {
          id: 3,
          name: 'Sans critères',
          color: '#0000FF',
          criteria: null
        }
      ];

      storage.getCategoriesForProfession.mockReturnValue(mockCategories);

      const result = calculateProfessionMetrics(1);

      expect(result.categoriesCount).toBe(1); // Only category with criteria
      expect(result.totalWeight).toBe(20);
      expect(result.totalCriteriaCount).toBe(1);
    });

    it('should handle default weight (15) when weight is missing', () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Technique',
          color: '#FF0000',
          criteria: [
            { id: 1, name: 'Autonomie', type: 'advantage' } // No weight
          ]
        }
      ];

      storage.getCategoriesForProfession.mockReturnValue(mockCategories);

      const result = calculateProfessionMetrics(1);

      expect(result.totalWeight).toBe(15); // Default weight
    });

    it('should calculate top 3 categories correctly', () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Cat1',
          color: '#FF0000',
          criteria: [
            { id: 1, name: 'C1', weight: 10, type: 'advantage' }
          ]
        },
        {
          id: 2,
          name: 'Cat2',
          color: '#00FF00',
          criteria: [
            { id: 2, name: 'C2', weight: 30, type: 'advantage' }
          ]
        },
        {
          id: 3,
          name: 'Cat3',
          color: '#0000FF',
          criteria: [
            { id: 3, name: 'C3', weight: 20, type: 'advantage' }
          ]
        },
        {
          id: 4,
          name: 'Cat4',
          color: '#FFFF00',
          criteria: [
            { id: 4, name: 'C4', weight: 5, type: 'advantage' }
          ]
        }
      ];

      storage.getCategoriesForProfession.mockReturnValue(mockCategories);

      const result = calculateProfessionMetrics(1);

      expect(result.topCategories).toHaveLength(3);
      expect(result.topCategories[0].name).toBe('Cat2'); // Highest weight (30)
      expect(result.topCategories[1].name).toBe('Cat3'); // Second (20)
      expect(result.topCategories[2].name).toBe('Cat1'); // Third (10)
    });

    it('should calculate top 3 criteria correctly', () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Technique',
          color: '#FF0000',
          criteria: [
            { id: 1, name: 'C1', weight: 5, type: 'advantage' },
            { id: 2, name: 'C2', weight: 25, type: 'advantage' },
            { id: 3, name: 'C3', weight: 15, type: 'advantage' },
            { id: 4, name: 'C4', weight: 10, type: 'advantage' }
          ]
        }
      ];

      storage.getCategoriesForProfession.mockReturnValue(mockCategories);

      const result = calculateProfessionMetrics(1);

      expect(result.topCriteria).toHaveLength(3);
      expect(result.topCriteria[0].weight).toBe(25);
      expect(result.topCriteria[1].weight).toBe(15);
      expect(result.topCriteria[2].weight).toBe(10);
    });

    it('should handle all criterion types correctly', () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Mixte',
          color: '#FF0000',
          criteria: [
            { id: 1, name: 'A1', weight: 10, type: 'advantage' },
            { id: 2, name: 'SA1', weight: 8, type: 'small_advantage' },
            { id: 3, name: 'N1', weight: 15, type: 'neutral' },
            { id: 4, name: 'SD1', weight: 12, type: 'small_disadvantage' },
            { id: 5, name: 'D1', weight: 20, type: 'disadvantage' }
          ]
        }
      ];

      storage.getCategoriesForProfession.mockReturnValue(mockCategories);

      const result = calculateProfessionMetrics(1);

      expect(result.typeDistribution.advantage).toBe(10);
      expect(result.typeDistribution.small_advantage).toBe(8);
      expect(result.typeDistribution.neutral).toBe(15);
      expect(result.typeDistribution.small_disadvantage).toBe(12);
      expect(result.typeDistribution.disadvantage).toBe(20);
    });
  });

  describe('calculateProfessionsMetrics', () => {
    it('should return empty object for empty array', () => {
      storage.getCategoriesForProfessions.mockReturnValue({});
      const result = calculateProfessionsMetrics([]);
      expect(result).toEqual({});
    });

    it('should calculate metrics for multiple professions efficiently', () => {
      const mockData = {
        1: [
          {
            id: 1,
            name: 'Technique',
            color: '#FF0000',
            criteria: [
              { id: 1, name: 'A1', weight: 20, type: 'advantage' }
            ]
          }
        ],
        2: [
          {
            id: 1,
            name: 'Technique',
            color: '#FF0000',
            criteria: [
              { id: 1, name: 'A1', weight: 30, type: 'advantage' }
            ]
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(mockData);

      const result = calculateProfessionsMetrics([1, 2]);

      expect(result).toHaveProperty('1');
      expect(result).toHaveProperty('2');
      expect(result[1].totalWeight).toBe(20);
      expect(result[2].totalWeight).toBe(30);
      
      // Should call getCategoriesForProfessions once, not multiple times
      expect(storage.getCategoriesForProfessions).toHaveBeenCalledTimes(1);
      expect(storage.getCategoriesForProfessions).toHaveBeenCalledWith([1, 2]);
    });

    it('should ignore categories without criteria for all professions', () => {
      const mockData = {
        1: [
          {
            id: 1,
            name: 'Avec critères',
            color: '#FF0000',
            criteria: [
              { id: 1, name: 'A1', weight: 20, type: 'advantage' }
            ]
          },
          {
            id: 2,
            name: 'Sans critères',
            color: '#00FF00',
            criteria: []
          }
        ]
      };

      storage.getCategoriesForProfessions.mockReturnValue(mockData);

      const result = calculateProfessionsMetrics([1]);

      expect(result[1].categoriesCount).toBe(1);
      expect(result[1].totalWeight).toBe(20);
    });
  });
});
