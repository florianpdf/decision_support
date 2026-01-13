import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfessions } from '../../hooks/useProfessions';
import * as storage from '../../services/storage';

vi.mock('../../services/storage', () => ({
  loadProfessions: vi.fn(() => []),
  saveProfessions: vi.fn(),
  addProfession: vi.fn((profession) => ({
    id: 1,
    ...profession,
    created_at: new Date().toISOString()
  })),
  updateProfession: vi.fn((id, updates) => ({ id, ...updates })),
  deleteProfession: vi.fn(),
  initializeProfessionWeights: vi.fn(),
  getCategoriesForProfession: vi.fn(() => []),
  loadCategories: vi.fn(() => []),
  loadCriteria: vi.fn(() => [])
}));

describe('useProfessions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.loadProfessions.mockReturnValue([]);
  });

  it('should load professions on mount', async () => {
    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(storage.loadProfessions).toHaveBeenCalled();
    });

    expect(result.current.loading).toBe(false);
  });

  it('should add a new profession', async () => {
    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const newProfession = result.current.handleAddProfession({
        name: 'Test Profession'
      });
      expect(newProfession).toHaveProperty('id');
      expect(newProfession.name).toBe('Test Profession');
    });

    expect(storage.addProfession).toHaveBeenCalled();
  });

  it('should throw error when profession name is empty', async () => {
    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        result.current.handleAddProfession({ name: '' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('obligatoire');
      }
    });
  });

  it('should throw error when max professions limit is reached', async () => {
    // Mock 5 professions (max limit)
    storage.loadProfessions.mockReturnValue(
      Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Profession ${i + 1}`,
        created_at: new Date().toISOString()
      }))
    );

    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        result.current.handleAddProfession({ name: 'New Profession' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('métiers');
      }
    });
  });

  it('should update a profession', async () => {
    const existingProfession = {
      id: 1,
      name: 'Old Name',
      created_at: new Date().toISOString()
    };

    storage.loadProfessions.mockReturnValue([existingProfession]);
    storage.updateProfession.mockReturnValue({ ...existingProfession, name: 'New Name' });

    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleUpdateProfession(1, { name: 'New Name' });
    });

    expect(storage.updateProfession).toHaveBeenCalledWith(1, { name: 'New Name' });
  });

  it('should delete a profession', async () => {
    const profession = {
      id: 1,
      name: 'Test Profession',
      created_at: new Date().toISOString()
    };

    storage.loadProfessions.mockReturnValue([profession]);
    storage.loadCategories.mockReturnValue([]);
    storage.loadCriteria.mockReturnValue([]);

    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleDeleteProfession(1);
    });

    expect(storage.deleteProfession).toHaveBeenCalledWith(1);
  });

  it('should throw error when deleting last profession with data', async () => {
    const profession = {
      id: 1,
      name: 'Test Profession',
      created_at: new Date().toISOString()
    };

    storage.loadProfessions.mockReturnValue([profession]);
    storage.loadCategories.mockReturnValue([
      { id: 1, name: 'Category', color: '#FF0000', criteria: [] }
    ]);
    storage.loadCriteria.mockReturnValue([]);

    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        result.current.handleDeleteProfession(1);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('CANT_DELETE_LAST_PROFESSION_WITH_DATA');
      }
    });
  });

  it('should set current profession to first available on load', async () => {
    const professions = [
      { id: 1, name: 'Profession 1', created_at: new Date().toISOString() },
      { id: 2, name: 'Profession 2', created_at: new Date().toISOString() }
    ];

    storage.loadProfessions.mockReturnValue(professions);

    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.currentProfessionId).toBe(1);
    });
  });

  it('should get current profession', async () => {
    const profession = {
      id: 1,
      name: 'Test Profession',
      created_at: new Date().toISOString()
    };

    storage.loadProfessions.mockReturnValue([profession]);

    const { result } = renderHook(() => useProfessions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentProfession).toEqual(profession);
  });
});
