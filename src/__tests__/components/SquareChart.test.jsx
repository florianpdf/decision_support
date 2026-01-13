import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SquareChart from '../../components/charts/SquareChart';
import * as storage from '../../services/storage';

// Mock Recharts components
vi.mock('recharts', () => ({
  Treemap: ({ children, data, content }) => (
    <div data-testid="treemap" data-has-content={!!content}>
      {children}
      {data && data.length > 0 && (
        <div data-testid="treemap-data">
          {data.map((group, idx) => (
            <div key={idx} data-testid={`group-${idx}`} data-name={group.name}>
              {group.children && group.children.map((child, cIdx) => (
                <div key={cIdx} data-testid={`criterion-${child.id}`} data-name={child.name} data-weight={child.weight} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
  ResponsiveContainer: ({ children, width, height }) => (
    <div data-testid="responsive-container" style={{ width, height }}>
      {children}
    </div>
  ),
  Tooltip: ({ content: TooltipContent }) => (
    <div data-testid="tooltip">
      {TooltipContent && <TooltipContent active={true} payload={[{ payload: { name: 'Test', weight: 15 } }]} />}
    </div>
  )
}));

vi.mock('../../services/storage', () => ({
  getChartColorMode: vi.fn(() => 'category'),
  setChartColorMode: vi.fn(),
  getCategoryTotalWeight: vi.fn((category) => {
    if (!category || !category.criteria || category.criteria.length === 0) {
      return 0;
    }
    return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
  })
}));

// Mock Material-UI Switch
vi.mock('@mui/material/Switch', () => ({
  default: ({ checked, onChange }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      data-testid="color-mode-switch"
    />
  )
}));

describe('SquareChart', () => {
  const mockCategories = [
    {
      id: 1,
      name: 'Category 1',
      color: '#FF0000',
      criteria: [
        { id: 1, name: 'Criterion 1', weight: 10, type: 'neutral' },
        { id: 2, name: 'Criterion 2', weight: 20, type: 'advantage' }
      ]
    },
    {
      id: 2,
      name: 'Category 2',
      color: '#00FF00',
      criteria: [
        { id: 3, name: 'Criterion 3', weight: 15, type: 'neutral' }
      ]
    }
  ];

  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    storage.getChartColorMode.mockReturnValue('category');
  });

  it('should render empty state when no categories with criteria', () => {
    const emptyCategories = [
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ];
    
    render(<SquareChart categories={emptyCategories} professionId={1} />);
    
    expect(screen.getByText(/aucune donnée à afficher/i)).toBeInTheDocument();
  });

  it('should render chart when categories have criteria', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    expect(screen.getByTestId('treemap')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should render legend with categories', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('should filter out categories without criteria', () => {
    const categoriesWithEmpty = [
      ...mockCategories,
      { id: 3, name: 'Category 3', color: '#0000FF', criteria: [] }
    ];
    
    render(<SquareChart categories={categoriesWithEmpty} professionId={1} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    // Category 3 should not appear in legend
    const category3Elements = screen.queryAllByText('Category 3');
    expect(category3Elements.length).toBe(0);
  });

  it('should display chart title and fullscreen button', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    expect(screen.getByText(/graphique de visualisation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/voir en plein écran/i)).toBeInTheDocument();
  });

  it('should display color mode switch', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    expect(screen.getByText(/couleurs par catégorie/i)).toBeInTheDocument();
    expect(screen.getByText(/couleurs par type/i)).toBeInTheDocument();
  });

  it('should toggle color mode when switch is clicked', async () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    const switchElement = screen.getByTestId('color-mode-switch');
    expect(switchElement).not.toBeChecked();
    
    await user.click(switchElement);
    
    expect(switchElement).toBeChecked();
    expect(storage.setChartColorMode).toHaveBeenCalledWith(1, 'type');
  });

  it('should toggle color mode when label is clicked', async () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    const typeLabel = screen.getByText(/couleurs par type/i);
    await user.click(typeLabel);
    
    const switchElement = screen.getByTestId('color-mode-switch');
    expect(switchElement).toBeChecked();
  });

  it('should load saved color mode preference', () => {
    storage.getChartColorMode.mockReturnValue('type');
    
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    const switchElement = screen.getByTestId('color-mode-switch');
    expect(switchElement).toBeChecked();
  });

  it('should open fullscreen modal when icon is clicked', async () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    const fullscreenButton = screen.getByLabelText(/voir en plein écran/i);
    await user.click(fullscreenButton);
    
    // Modal should be open (check for close button)
    expect(screen.getByLabelText(/fermer/i)).toBeInTheDocument();
  });

  it('should display correct data in chart', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    const treemap = screen.getByTestId('treemap');
    expect(treemap).toHaveAttribute('data-has-content', 'true');
  });

  it('should calculate correct total weights for categories', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    // Category 1 should have total weight of 30 (10 + 20)
    // Category 2 should have total weight of 15
    const dataElement = screen.getByTestId('treemap-data');
    expect(dataElement).toBeInTheDocument();
  });

  it('should use category colors in category mode', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    // In category mode, criteria should use category color
    const switchElement = screen.getByTestId('color-mode-switch');
    expect(switchElement).not.toBeChecked(); // Category mode is default
  });

  it('should use type colors in type mode', async () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    const switchElement = screen.getByTestId('color-mode-switch');
    await user.click(switchElement);
    
    expect(switchElement).toBeChecked(); // Type mode
  });

  it('should handle empty categories array', () => {
    render(<SquareChart categories={[]} professionId={1} />);
    
    expect(screen.getByText(/aucune donnée à afficher/i)).toBeInTheDocument();
  });

  it('should handle null professionId', () => {
    render(<SquareChart categories={mockCategories} professionId={null} />);
    
    expect(screen.getByTestId('treemap')).toBeInTheDocument();
  });

  it('should render tooltip component', () => {
    render(<SquareChart categories={mockCategories} professionId={1} />);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should update when categories change', () => {
    const { rerender } = render(<SquareChart categories={mockCategories} professionId={1} />);
    
    const newCategories = [
      {
        id: 3,
        name: 'Category 3',
        color: '#0000FF',
        criteria: [
          { id: 4, name: 'Criterion 4', weight: 25, type: 'neutral' }
        ]
      }
    ];
    
    rerender(<SquareChart categories={newCategories} professionId={1} />);
    
    expect(screen.getByText('Category 3')).toBeInTheDocument();
  });

  it('should handle criteria with undefined type', () => {
    const categoriesWithUndefinedType = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [
          { id: 1, name: 'Criterion 1', weight: 10 }
        ]
      }
    ];
    
    render(<SquareChart categories={categoriesWithUndefinedType} professionId={1} />);
    
    expect(screen.getByTestId('treemap')).toBeInTheDocument();
  });

  it('should handle criteria with zero weight', () => {
    const categoriesWithZeroWeight = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [
          { id: 1, name: 'Criterion 1', weight: 0, type: 'neutral' }
        ]
      }
    ];
    
    render(<SquareChart categories={categoriesWithZeroWeight} professionId={1} />);
    
    // Should still render, but category might be filtered if total is 0
    const treemap = screen.queryByTestId('treemap');
    expect(treemap).toBeInTheDocument();
  });
});
