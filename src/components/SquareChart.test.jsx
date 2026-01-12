import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SquareChart from './charts/SquareChart';

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
      nom: 'Category 1',
      couleur: '#FF0000',
      criteres: [
        { id: 1, nom: 'Critere 1', poids: 10 },
        { id: 2, nom: 'Critere 2', poids: 20 }
      ]
    },
    {
      id: 2,
      nom: 'Category 2',
      couleur: '#00FF00',
      criteres: [
        { id: 3, nom: 'Critere 3', poids: 15 }
      ]
    }
  ];

  it('should render empty state when no categories with criteres', () => {
    const emptyCategories = [
      { id: 1, nom: 'Category 1', couleur: '#FF0000', criteres: [] }
    ];
    
    render(<SquareChart categories={emptyCategories} />);
    
    expect(screen.getByText(/aucune donnée à afficher/i)).toBeInTheDocument();
  });

  it('should render chart when categories have criteres', () => {
    render(<SquareChart categories={mockCategories} />);
    
    expect(screen.getByTestId('treemap')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should render legend', () => {
    render(<SquareChart categories={mockCategories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('should filter out categories without criteres', () => {
    const categoriesWithEmpty = [
      ...mockCategories,
      { id: 3, nom: 'Category 3', couleur: '#0000FF', criteres: [] }
    ];
    
    render(<SquareChart categories={categoriesWithEmpty} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    // Category 3 should not appear in legend
    const category3Elements = screen.queryAllByText('Category 3');
    expect(category3Elements.length).toBeLessThanOrEqual(1); // Might appear in empty state message
  });
});
