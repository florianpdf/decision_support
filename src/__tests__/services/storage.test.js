import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadCategories,
  saveCategories,
  getNextCategoryId,
  setNextCategoryId,
  getNextCriterionId,
  setNextCriterionId,
  addCategory,
  updateCategory,
  deleteCategory,
  addCriterion,
  updateCriterion,
  deleteCriterion,
  getCategoryTotalWeight,
  loadProfessions,
  addProfession,
  getCategoriesForProfession
} from '../../services/storage';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadCategories', () => {
    it('should return empty array when localStorage is empty', () => {
      expect(loadCategories()).toEqual([]);
    });

    it('should return categories from localStorage', () => {
      const categories = [{ id: 1, name: 'Test', color: '#000', criterionIds: [] }];
      localStorage.setItem('bulle_chart_categories', JSON.stringify(categories));
      expect(loadCategories()).toEqual(categories);
    });

    it('should return empty array on parse error', () => {
      localStorage.setItem('bulle_chart_categories', 'invalid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(loadCategories()).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  describe('saveCategories', () => {
    it('should save categories to localStorage', () => {
      const categories = [{ id: 1, name: 'Test', color: '#000', criterionIds: [] }];
      expect(saveCategories(categories)).toBe(true);
      expect(JSON.parse(localStorage.getItem('bulle_chart_categories'))).toEqual(categories);
    });

    it('should return false on save error', () => {
      const categories = [{ id: 1, name: 'Test', color: '#000', criterionIds: [] }];
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(saveCategories(categories)).toBe(false);
      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('getNextCategoryId', () => {
    it('should return 1 when no ID is stored', () => {
      expect(getNextCategoryId()).toBe(1);
    });

    it('should return stored ID', () => {
      localStorage.setItem('bulle_chart_next_category_id', '5');
      expect(getNextCategoryId()).toBe(5);
    });
  });

  describe('setNextCategoryId', () => {
    it('should save next category ID', () => {
      setNextCategoryId(5);
      expect(localStorage.getItem('bulle_chart_next_category_id')).toBe('5');
    });
  });

  describe('getNextCriterionId', () => {
    it('should return 1 when no ID is stored', () => {
      expect(getNextCriterionId()).toBe(1);
    });

    it('should return stored ID', () => {
      localStorage.setItem('bulle_chart_next_criterion_id', '10');
      expect(getNextCriterionId()).toBe(10);
    });
  });

  describe('setNextCriterionId', () => {
    it('should save next criterion ID', () => {
      setNextCriterionId(10);
      expect(localStorage.getItem('bulle_chart_next_criterion_id')).toBe('10');
    });
  });

  describe('addCategory', () => {
    it('should add a new category', () => {
      const category = { name: 'Test Category', color: '#FF0000' };
      const result = addCategory(category);
      
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Category');
      expect(result.color).toBe('#FF0000');
      expect(result.criterionIds).toEqual([]);
      expect(result.created_at).toBeDefined();
      
      const categories = loadCategories();
      expect(categories).toHaveLength(1);
      expect(categories[0]).toEqual(result);
    });

    it('should trim category name', () => {
      const category = { name: '  Test Category  ', color: '#FF0000' };
      const result = addCategory(category);
      expect(result.name).toBe('Test Category');
    });

    it('should increment category ID', () => {
      addCategory({ name: 'Category 1', color: '#FF0000' });
      const result = addCategory({ name: 'Category 2', color: '#00FF00' });
      expect(result.id).toBe(2);
    });
  });

  describe('updateCategory', () => {
    it('should update category name', () => {
      addCategory({ name: 'Original', color: '#FF0000' });
      const result = updateCategory(1, { name: 'Updated' });
      
      expect(result.name).toBe('Updated');
      expect(loadCategories()[0].name).toBe('Updated');
    });

    it('should update category color', () => {
      addCategory({ name: 'Test', color: '#FF0000' });
      const result = updateCategory(1, { color: '#00FF00' });
      
      expect(result.color).toBe('#00FF00');
      expect(loadCategories()[0].color).toBe('#00FF00');
    });

    it('should update both name and color', () => {
      addCategory({ name: 'Original', color: '#FF0000' });
      const result = updateCategory(1, { name: 'Updated', color: '#00FF00' });
      
      expect(result.name).toBe('Updated');
      expect(result.color).toBe('#00FF00');
    });

    it('should trim updated name', () => {
      addCategory({ name: 'Original', color: '#FF0000' });
      const result = updateCategory(1, { name: '  Updated  ' });
      expect(result.name).toBe('Updated');
    });

    it('should return null if category not found', () => {
      expect(updateCategory(999, { name: 'Updated' })).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', () => {
      addCategory({ name: 'Category 1', color: '#FF0000' });
      addCategory({ name: 'Category 2', color: '#00FF00' });
      
      deleteCategory(1);
      
      const categories = loadCategories();
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Category 2');
    });

    it('should return true after deletion', () => {
      addCategory({ name: 'Test', color: '#FF0000' });
      expect(deleteCategory(1)).toBe(true);
    });
  });

  describe('addCriterion', () => {
    it('should add a new criterion', () => {
      addCategory({ name: 'Test Category', color: '#FF0000' });
      const criterion = { name: 'Test Criterion', categoryId: 1 };
      const result = addCriterion(1, criterion);
      
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Criterion');
      expect(result.categoryId).toBe(1);
      expect(result.created_at).toBeDefined();
    });

    it('should trim criterion name', () => {
      addCategory({ name: 'Test', color: '#FF0000' });
      const result = addCriterion(1, { name: '  Test Criterion  ', categoryId: 1 });
      expect(result.name).toBe('Test Criterion');
    });
  });

  describe('updateCriterion', () => {
    it('should update criterion name', () => {
      addCategory({ name: 'Test', color: '#FF0000' });
      addCriterion(1, { name: 'Original', categoryId: 1 });
      const result = updateCriterion(1, { name: 'Updated' });
      
      expect(result.name).toBe('Updated');
    });

    it('should trim updated name', () => {
      addCategory({ name: 'Test', color: '#FF0000' });
      addCriterion(1, { name: 'Original', categoryId: 1 });
      const result = updateCriterion(1, { name: '  Updated  ' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('deleteCriterion', () => {
    it('should delete a criterion', () => {
      addCategory({ name: 'Test', color: '#FF0000' });
      addCriterion(1, { name: 'Criterion 1', categoryId: 1 });
      addCriterion(1, { name: 'Criterion 2', categoryId: 1 });
      
      deleteCriterion(1);
      
      // Check that criterion is removed from category
      const categories = loadCategories();
      expect(categories[0].criterionIds).not.toContain(1);
    });
  });

  describe('getCategoryTotalWeight', () => {
    it('should return 0 for empty category', () => {
      const category = { id: 1, name: 'Test', color: '#FF0000', criteria: [] };
      expect(getCategoryTotalWeight(category, 1)).toBe(0);
    });

    it('should return 0 for category with no criteria property', () => {
      const category = { id: 1, name: 'Test', color: '#FF0000' };
      expect(getCategoryTotalWeight(category, 1)).toBe(0);
    });

    it('should calculate total weight', () => {
      const category = {
        id: 1,
        name: 'Test',
        color: '#FF0000',
        criteria: [
          { id: 1, name: 'Criterion 1', weight: 10 },
          { id: 2, name: 'Criterion 2', weight: 20 },
          { id: 3, name: 'Criterion 3', weight: 30 }
        ]
      };
      expect(getCategoryTotalWeight(category, 1)).toBe(60);
    });
  });

  describe('Professions', () => {
    it('should load empty professions', () => {
      expect(loadProfessions()).toEqual([]);
    });

    it('should add a profession', () => {
      const profession = { name: 'Test Profession' };
      const result = addProfession(profession);
      
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Profession');
    });
  });

  describe('getCategoriesForProfession', () => {
    it('should return empty array when no categories', () => {
      addProfession({ name: 'Test Profession' });
      expect(getCategoriesForProfession(1)).toEqual([]);
    });

    it('should return categories with criteria for profession', () => {
      const profession = addProfession({ name: 'Test Profession' });
      const category = addCategory({ name: 'Test Category', color: '#FF0000' });
      const criterion = addCriterion(category.id, { name: 'Test Criterion', categoryId: category.id });
      
      // Initialize weights for profession
      // This is normally done by useCategories hook
      
      const categories = getCategoriesForProfession(profession.id);
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Test Category');
    });
  });
});

