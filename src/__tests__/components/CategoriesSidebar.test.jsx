import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoriesSidebar from '../../components/CategoriesSidebar';
import * as storage from '../../services/storage';

vi.mock('../../services/storage', () => ({
  getCategoryTotalWeight: vi.fn((category) => {
    if (!category || !category.criteria || category.criteria.length === 0) {
      return 0;
    }
    return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
  })
}));

describe('CategoriesSidebar', () => {
  const mockCategories = [
    {
      id: 1,
      name: 'Category 1',
      color: '#FF0000',
      criteria: [
        { id: 1, name: 'Criterion 1', weight: 15, type: 'neutral' }
      ]
    },
    {
      id: 2,
      name: 'Category 2',
      color: '#00FF00',
      criteria: []
    }
  ];

  const mockOnSelectCategory = vi.fn();
  const mockOnCreateCategory = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSelectCategory.mockClear();
    mockOnCreateCategory.mockClear();
    storage.getCategoryTotalWeight.mockImplementation((category) => {
      if (!category || !category.criteria || category.criteria.length === 0) {
        return 0;
      }
      return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
    });
  });

  it('should render create button', () => {
    render(
      <CategoriesSidebar
        categories={[]}
        selectedCategoryId={null}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    expect(screen.getByRole('button', { name: /créer un nouvel intérêt professionnel/i })).toBeInTheDocument();
  });

  it('should call onCreateCategory when create button is clicked', async () => {
    render(
      <CategoriesSidebar
        categories={[]}
        selectedCategoryId={null}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    const createButton = screen.getByRole('button', { name: /créer un nouvel intérêt professionnel/i });
    await user.click(createButton);

    expect(mockOnCreateCategory).toHaveBeenCalled();
  });

  it('should display empty state when no categories', () => {
    render(
      <CategoriesSidebar
        categories={[]}
        selectedCategoryId={null}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    expect(screen.getByText(/aucun intérêt professionnel créé/i)).toBeInTheDocument();
  });

  it('should render list of categories', () => {
    render(
      <CategoriesSidebar
        categories={mockCategories}
        selectedCategoryId={null}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('should highlight selected category', () => {
    render(
      <CategoriesSidebar
        categories={mockCategories}
        selectedCategoryId={1}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    const category1 = screen.getByText('Category 1').closest('.category-item-sidebar');
    expect(category1).toHaveClass('selected');
  });

  it('should call onSelectCategory when category is clicked', async () => {
    render(
      <CategoriesSidebar
        categories={mockCategories}
        selectedCategoryId={null}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    const category1 = screen.getByText('Category 1').closest('.category-item-sidebar');
    await user.click(category1);

    expect(mockOnSelectCategory).toHaveBeenCalledWith(1);
  });

  it('should call onSelectCategory on Enter key', async () => {
    render(
      <CategoriesSidebar
        categories={mockCategories}
        selectedCategoryId={null}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    const category1 = screen.getByText('Category 1').closest('.category-item-sidebar');
    category1.focus();
    await user.keyboard('{Enter}');

    expect(mockOnSelectCategory).toHaveBeenCalledWith(1);
  });

  it('should display category statistics', () => {
    render(
      <CategoriesSidebar
        categories={mockCategories}
        selectedCategoryId={null}
        onSelectCategory={mockOnSelectCategory}
        onCreateCategory={mockOnCreateCategory}
      />
    );

    // Should show criteria count and total weight
    expect(screen.getByText(/1 motivation/i)).toBeInTheDocument();
  });
});
