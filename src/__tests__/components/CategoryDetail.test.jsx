import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryDetail from '../../components/CategoryDetail';
import * as storage from '../../services/storage';

vi.mock('../../services/storage', () => ({
  getCategoryTotalWeight: vi.fn((category) => {
    if (!category || !category.criteria || category.criteria.length === 0) {
      return 0;
    }
    return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
  })
}));

describe('CategoryDetail', () => {
  const mockCategory = {
    id: 1,
    name: 'Test Category',
    color: '#FF0000',
    criteria: [
      { id: 1, name: 'Criterion 1', weight: 15, type: 'neutral' },
      { id: 2, name: 'Criterion 2', weight: 20, type: 'advantage' }
    ]
  };

  const mockOnUpdateCategory = vi.fn();
  const mockOnDeleteCategory = vi.fn();
  const mockOnAddCriterion = vi.fn();
  const mockOnUpdateCriterion = vi.fn();
  const mockOnDeleteCriterion = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnUpdateCategory.mockClear();
    mockOnDeleteCategory.mockClear();
    mockOnAddCriterion.mockClear();
    mockOnUpdateCriterion.mockClear();
    mockOnDeleteCriterion.mockClear();
    storage.getCategoryTotalWeight.mockImplementation((category) => {
      if (!category || !category.criteria || category.criteria.length === 0) {
        return 0;
      }
      return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
    });
  });

  it('should display empty state when no category', () => {
    render(
      <CategoryDetail
        category={null}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    expect(screen.getByText(/aucun intérêt professionnel sélectionné/i)).toBeInTheDocument();
  });

  it('should render category details', () => {
    render(
      <CategoryDetail
        category={mockCategory}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText(/2 motivation/i)).toBeInTheDocument();
  });

  it('should show edit form when edit button is clicked', async () => {
    render(
      <CategoryDetail
        category={mockCategory}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    const editButton = screen.getByLabelText(/modifier l'intérêt professionnel/i);
    await user.click(editButton);

    expect(screen.getByLabelText(/nom de l'intérêt professionnel/i)).toBeInTheDocument();
  });

  it('should call onDeleteCategory when delete button is clicked', async () => {
    const categoryWithoutCriteria = {
      id: 1,
      name: 'Test Category',
      color: '#FF0000',
      criteria: []
    };

    render(
      <CategoryDetail
        category={categoryWithoutCriteria}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    const deleteButton = screen.getByLabelText(/supprimer l'intérêt professionnel/i);
    await user.click(deleteButton);

    expect(mockOnDeleteCategory).toHaveBeenCalledWith(1);
  });

  it('should disable delete button when category has criteria', () => {
    render(
      <CategoryDetail
        category={mockCategory}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    const deleteButton = screen.getByLabelText(/impossible de supprimer/i);
    expect(deleteButton).toBeDisabled();
  });

  it('should show add criterion form when button is clicked', async () => {
    render(
      <CategoryDetail
        category={mockCategory}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    const addButton = screen.getByRole('button', { name: /ajouter une motivation clé/i });
    await user.click(addButton);

    expect(screen.getByRole('textbox', { name: /nom de la motivation clé/i })).toBeInTheDocument();
  });

  it('should toggle all criteria when toggle button is clicked', async () => {
    render(
      <CategoryDetail
        category={mockCategory}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    const toggleButton = screen.getByLabelText(/tout ouvrir/i);
    await user.click(toggleButton);

    // Button label should change
    expect(screen.getByLabelText(/tout fermer/i)).toBeInTheDocument();
  });

  it('should not show toggle button when category has no criteria', () => {
    const categoryWithoutCriteria = {
      id: 1,
      name: 'Test Category',
      color: '#FF0000',
      criteria: []
    };

    render(
      <CategoryDetail
        category={categoryWithoutCriteria}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    expect(screen.queryByLabelText(/tout ouvrir/i)).not.toBeInTheDocument();
  });

  it('should display empty state message when no criteria', () => {
    const categoryWithoutCriteria = {
      id: 1,
      name: 'Test Category',
      color: '#FF0000',
      criteria: []
    };

    render(
      <CategoryDetail
        category={categoryWithoutCriteria}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    expect(screen.getByText(/aucune motivation clé/i)).toBeInTheDocument();
  });

  it('should call onAddCriterion when form is submitted', async () => {
    render(
      <CategoryDetail
        category={mockCategory}
        onUpdateCategory={mockOnUpdateCategory}
        onDeleteCategory={mockOnDeleteCategory}
        onAddCriterion={mockOnAddCriterion}
        onUpdateCriterion={mockOnUpdateCriterion}
        onDeleteCriterion={mockOnDeleteCriterion}
        existingCategories={[]}
      />
    );

    const addButton = screen.getByRole('button', { name: /ajouter une motivation clé/i });
    await user.click(addButton);

    const nameInput = screen.getByRole('textbox', { name: /nom de la motivation clé/i });
    const submitButton = screen.getByRole('button', { name: /ajouter la motivation clé/i });

    await user.type(nameInput, 'New Criterion');
    await user.click(submitButton);

    expect(mockOnAddCriterion).toHaveBeenCalledWith(1, expect.objectContaining({
      name: 'New Criterion'
    }));
  });
});
