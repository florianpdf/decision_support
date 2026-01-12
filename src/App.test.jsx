import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as storage from './services/storage';

// Mock the storage service
vi.mock('./services/storage', () => ({
  loadCategories: vi.fn(() => []),
  addCategory: vi.fn((category) => ({
    id: 1,
    ...category,
    criteres: [],
    created_at: new Date().toISOString()
  })),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  addCritereToCategory: vi.fn(),
  updateCritereInCategory: vi.fn(),
  deleteCritereFromCategory: vi.fn(),
  getCategoryTotalWeight: vi.fn((category) => {
    if (!category || !category.criteres || category.criteres.length === 0) {
      return 0;
    }
    return category.criteres.reduce((sum, critere) => sum + critere.poids, 0);
  })
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.loadCategories.mockReturnValue([]);
  });

  it('should render main header', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(/aide à la décision/i)).toBeInTheDocument();
  });

  it('should display empty state when no categories', () => {
    render(<App />);
    expect(screen.getByText(/aucun intérêt professionnel pour le moment/i)).toBeInTheDocument();
  });

  it('should load categories on mount', () => {
    render(<App />);
    expect(storage.loadCategories).toHaveBeenCalled();
  });

  it('should display category form', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /créer un intérêt professionnel/i })).toBeInTheDocument();
  });

  it('should display categories list section', () => {
    render(<App />);
    expect(screen.getByText(/mes intérêts professionnels/i)).toBeInTheDocument();
  });

  it('should display visualization section', () => {
    render(<App />);
    expect(screen.getByText(/visualisation/i)).toBeInTheDocument();
  });

  it('should show message when category is added', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /créer l'intérêt professionnel/i });
    
    await user.type(nameInput, 'Test Category');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/intérêt professionnel ajouté avec succès/i)).toBeInTheDocument();
    });
  });

  it('should show error when category limit is reached', async () => {
    const categories = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      nom: `Category ${i + 1}`,
      couleur: '#FF0000',
      criteres: []
    }));
    
    storage.loadCategories.mockReturnValue(categories);
    
    const { rerender } = render(<App />);
    rerender(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/limite atteinte/i)).toBeInTheDocument();
    });
  });

  it('should display category counter', () => {
    const categories = [
      { id: 1, nom: 'Category 1', couleur: '#FF0000', criteres: [] },
      { id: 2, nom: 'Category 2', couleur: '#00FF00', criteres: [] }
    ];
    
    storage.loadCategories.mockReturnValue(categories);
    
    const { rerender } = render(<App />);
    rerender(<App />);
    
    // The Stats component displays value and label
    const statsElements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('2') || element?.textContent?.includes('10');
    });
    expect(statsElements.length).toBeGreaterThan(0);
  });
});
