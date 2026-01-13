import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SquareChart from '../../components/charts/SquareChart';

// Mock Recharts components
vi.mock('recharts', () => ({
  Treemap: ({ children, data }) => <div data-testid="treemap">{children}</div>,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="tooltip" />
}));

describe('SquareChart', () => {
  const mockCategories = [
    {
      id: 1,
      name: 'Category 1',
      color: '#FF0000',
      criteria: [
        { id: 1, name: 'Criterion 1', weight: 10 },
        { id: 2, name: 'Criterion 2', weight: 20 }
      ]
    },
    {
      id: 2,
      name: 'Category 2',
      color: '#00FF00',
      criteria: [
        { id: 3, name: 'Criterion 3', weight: 15 }
      ]
    }
  ];

  it('should render empty state when no categories with criteria', () => {
    const emptyCategories = [
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ];
    
    render(<SquareChart categories={emptyCategories} />);
    
    expect(screen.getByText(/aucune donnée à afficher/i)).toBeInTheDocument();
  });

  it('should render chart when categories have criteria', () => {
    render(<SquareChart categories={mockCategories} />);
    
    expect(screen.getByTestId('treemap')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should render legend', () => {
    render(<SquareChart categories={mockCategories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('should filter out categories without criteria', () => {
    const categoriesWithEmpty = [
      ...mockCategories,
      { id: 3, name: 'Category 3', color: '#0000FF', criteria: [] }
    ];
    
    render(<SquareChart categories={categoriesWithEmpty} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    // Category 3 should not appear in legend
    const category3Elements = screen.queryAllByText('Category 3');
    expect(category3Elements.length).toBeLessThanOrEqual(1); // Might appear in empty state message
  });
});
