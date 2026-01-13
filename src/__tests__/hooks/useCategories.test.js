import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCategories } from '../../hooks/useCategories';
import * as storage from '../../services/storage';

vi.mock('../../services/storage', () => ({
  loadCategories: vi.fn(() => []),
  addCategory: vi.fn((category) => ({
    id: 1,
    ...category,
    criteria: [],
    created_at: new Date().toISOString()
  })),
  updateCategory: vi.fn((id, updates) => ({ id, ...updates })),
  deleteCategory: vi.fn(),
  loadCriteria: vi.fn(() => []),
  addCriterion: vi.fn((categoryId, criterion) => ({
    id: 1,
    categoryId,
    ...criterion,
    created_at: new Date().toISOString()
  })),
  updateCriterion: vi.fn((id, updates) => ({ id, ...updates })),
  deleteCriterion: vi.fn(),
  setCriterionWeight: vi.fn(),
  setCriterionType: vi.fn(),
  getCategoriesForProfession: vi.fn((professionId) => [])
}));

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.getCategoriesForProfession.mockReturnValue([]);
  });

  it('should load categories on mount', async () => {
    const mockCategories = [
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ];
    storage.getCategoriesForProfession.mockReturnValue(mockCategories);

    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
  });

  it('should return empty array when professionId is null', async () => {
    const { result } = renderHook(() => useCategories(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
  });

  it('should add a category', async () => {
    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const categoryId = result.current.handleAddCategory({
        name: 'New Category',
        color: '#FF0000'
      });
      expect(categoryId).toBe(1);
    });

    expect(storage.addCategory).toHaveBeenCalled();
  });

  it('should throw error when category name is invalid', async () => {
    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      expect(() => {
        result.current.handleAddCategory({
          name: '',
          color: '#FF0000'
        });
      }).toThrow();
    });
  });

  it('should throw error when category limit is reached', async () => {
    // Mock 10 categories (max limit)
    storage.loadCategories.mockReturnValue(
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Category ${i + 1}`,
        color: '#FF0000',
        criteria: []
      }))
    );

    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      expect(() => {
        result.current.handleAddCategory({
          name: 'New Category',
          color: '#FF0000'
        });
      }).toThrow();
    });
  });

  it('should throw error when color is already used', async () => {
    storage.loadCategories.mockReturnValue([
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ]);

    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      expect(() => {
        result.current.handleAddCategory({
          name: 'New Category',
          color: '#FF0000'
        });
      }).toThrow();
    });
  });

  it('should update a category', async () => {
    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleUpdateCategory(1, { name: 'Updated Category' });
    });

    expect(storage.updateCategory).toHaveBeenCalledWith(1, { name: 'Updated Category' });
  });

  it('should throw error when updating with used color', async () => {
    storage.loadCategories.mockReturnValue([
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] },
      { id: 2, name: 'Category 2', color: '#00FF00', criteria: [] }
    ]);

    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      expect(() => {
        result.current.handleUpdateCategory(1, { color: '#00FF00' });
      }).toThrow();
    });
  });

  it('should delete a category', async () => {
    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleDeleteCategory(1);
    });

    expect(storage.deleteCategory).toHaveBeenCalledWith(1);
  });

  it('should add a criterion', async () => {
    storage.loadCategories.mockReturnValue([
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ]);

    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleAddCriterion(1, {
        name: 'New Criterion',
        weight: 15,
        type: 'neutral'
      });
    });

    expect(storage.addCriterion).toHaveBeenCalled();
    expect(storage.setCriterionWeight).toHaveBeenCalled();
  });

  it('should throw error when criterion name is invalid', async () => {
    storage.loadCategories.mockReturnValue([
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ]);

    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      expect(() => {
        result.current.handleAddCriterion(1, {
          name: '',
          weight: 15
        });
      }).toThrow();
    });
  });

  it('should throw error when criterion weight is invalid', async () => {
    storage.loadCategories.mockReturnValue([
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ]);

    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      expect(() => {
        result.current.handleAddCriterion(1, {
          name: 'Criterion',
          weight: 100 // Invalid
        });
      }).toThrow();
    });
  });

  it('should update a criterion', async () => {
    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleUpdateCriterion(1, 1, {
        name: 'Updated Criterion',
        weight: 20
      });
    });

    expect(storage.setCriterionWeight).toHaveBeenCalled();
    expect(storage.updateCriterion).toHaveBeenCalled();
  });

  it('should delete a criterion', async () => {
    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleDeleteCriterion(1, 1);
    });

    expect(storage.deleteCriterion).toHaveBeenCalledWith(1);
  });

  it('should reload categories', async () => {
    const { result } = renderHook(() => useCategories(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.reloadCategories();
    });

    expect(storage.getCategoriesForProfession).toHaveBeenCalled();
  });
});
