import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Legend from '../../components/charts/Legend';
import * as storage from '../../services/storage';

vi.mock('../../services/storage', () => ({
  getCategoryTotalWeight: vi.fn((category) => {
    if (!category || !category.criteria || category.criteria.length === 0) {
      return 0;
    }
    return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
  })
}));

describe('Legend', () => {
  const mockCategories = [
    {
      id: 1,
      name: 'Category 1',
      color: '#FF0000',
      criteria: [
        { id: 1, name: 'Criterion 1', weight: 15, type: 'neutral' },
        { id: 2, name: 'Criterion 2', weight: 20, type: 'advantage' }
      ]
    },
    {
      id: 2,
      name: 'Category 2',
      color: '#00FF00',
      criteria: []
    }
  ];

  beforeEach(() => {
    storage.getCategoryTotalWeight.mockImplementation((category) => {
      if (!category || !category.criteria || category.criteria.length === 0) {
        return 0;
      }
      return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
    });
  });

  it('should return null when no categories with criteria', () => {
    const { container } = render(
      <Legend
        categories={[{ id: 1, name: 'Category', color: '#FF0000', criteria: [] }]}
        colorMode="category"
        professionId={1}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render categories in category mode', () => {
    render(
      <Legend
        categories={mockCategories}
        colorMode="category"
        professionId={1}
      />
    );

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.queryByText('Category 2')).not.toBeInTheDocument(); // No criteria
  });

  it('should display category statistics', () => {
    render(
      <Legend
        categories={mockCategories}
        colorMode="category"
        professionId={1}
      />
    );

    expect(screen.getByText(/2 motivation/i)).toBeInTheDocument();
    expect(screen.getByText(/importance: 35/i)).toBeInTheDocument();
  });

  it('should render types in type mode', () => {
    render(
      <Legend
        categories={mockCategories}
        colorMode="type"
        professionId={1}
      />
    );

    expect(screen.getByText(/nsp/i)).toBeInTheDocument();
    expect(screen.getByText(/avantage/i)).toBeInTheDocument();
  });

  it('should display type statistics', () => {
    render(
      <Legend
        categories={mockCategories}
        colorMode="type"
        professionId={1}
      />
    );

    // Should show count and total weight for each type
    // There are two types with 1 motivation each, so use getAllByText
    const motivationTexts = screen.getAllByText(/1 motivation/i);
    expect(motivationTexts.length).toBeGreaterThan(0);
  });

  it('should return null in type mode when no types have data', () => {
    const { container } = render(
      <Legend
        categories={[{ id: 1, name: 'Category', color: '#FF0000', criteria: [] }]}
        colorMode="type"
        professionId={1}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should apply compact class when compact prop is true', () => {
    const { container } = render(
      <Legend
        categories={mockCategories}
        colorMode="category"
        professionId={1}
        compact={true}
      />
    );

    const legend = container.querySelector('.legend-integrated');
    expect(legend).toHaveClass('legend-compact');
  });

  it('should not apply compact class when compact prop is false', () => {
    const { container } = render(
      <Legend
        categories={mockCategories}
        colorMode="category"
        professionId={1}
        compact={false}
      />
    );

    const legend = container.querySelector('.legend-integrated');
    expect(legend).not.toHaveClass('legend-compact');
  });

  it('should handle categories with undefined criteria', () => {
    const categoriesWithUndefined = [
      { id: 1, name: 'Category 1', color: '#FF0000' }
    ];

    const { container } = render(
      <Legend
        categories={categoriesWithUndefined}
        colorMode="category"
        professionId={1}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle criteria with undefined type', () => {
    const categoriesWithUndefinedType = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [
          { id: 1, name: 'Criterion 1', weight: 15 }
        ]
      }
    ];

    render(
      <Legend
        categories={categoriesWithUndefinedType}
        colorMode="type"
        professionId={1}
      />
    );

    // Should default to 'neutral' type
    expect(screen.getByText(/nsp/i)).toBeInTheDocument();
  });
});
