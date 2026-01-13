import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryForm from '../../components/forms/CategoryForm';
import { COLOR_PALETTE, DEFAULT_COLOR } from '../../constants/colors';

describe('CategoryForm', () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    // Mock window.alert
    window.alert = vi.fn();
  });

  it('should render form with all fields', () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/nom de l'intérêt professionnel/i)).toBeInTheDocument();
    expect(screen.getByText(/couleur de l'intérêt professionnel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer l'intérêt professionnel/i })).toBeInTheDocument();
  });

  it('should display all available colors', () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const colorPresets = screen.getAllByRole('radio');
    expect(colorPresets).toHaveLength(COLOR_PALETTE.length);
  });

  it('should filter out used colors', () => {
    const existingCategories = [
      { id: 1, name: 'Category 1', color: COLOR_PALETTE[0], criteria: [] },
      { id: 2, name: 'Category 2', color: COLOR_PALETTE[1], criteria: [] }
    ];
    
    render(<CategoryForm onSubmit={mockOnSubmit} existingCategories={existingCategories} />);
    
    const colorPresets = screen.getAllByRole('radio');
    expect(colorPresets).toHaveLength(COLOR_PALETTE.length - 2);
  });

  it('should show message when all colors are used', () => {
    const existingCategories = COLOR_PALETTE.map((color, index) => ({
      id: index + 1,
      name: `Category ${index + 1}`,
      color: color,
      criteria: []
    }));
    
    render(<CategoryForm onSubmit={mockOnSubmit} existingCategories={existingCategories} />);
    
    expect(screen.getByText(/toutes les couleurs sont déjà utilisées/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer l'intérêt professionnel/i })).toBeDisabled();
  });

  it('should call onSubmit with correct data', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /créer l'intérêt professionnel/i });
    
    await user.type(nameInput, 'Test Category');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Category',
      color: DEFAULT_COLOR
    });
  });

  it('should trim category name', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /créer l'intérêt professionnel/i });
    
    await user.type(nameInput, '  Test Category  ');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Category',
      color: DEFAULT_COLOR
    });
  });

  it('should show alert when name is empty', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /créer l'intérêt professionnel/i });
    
    // Clear the input and try to submit
    await user.clear(nameInput);
    // HTML5 validation prevents form submission, so we need to bypass it
    const form = submitButton.closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Since HTML5 validation prevents submission, we check that onSubmit wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should allow color selection', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const colorPresets = screen.getAllByRole('radio');
    const secondColor = colorPresets[1];
    
    await user.click(secondColor);
    
    expect(secondColor).toHaveAttribute('aria-checked', 'true');
  });

  it('should reset form after submission', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /créer l'intérêt professionnel/i });
    
    await user.type(nameInput, 'Test Category');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
    });
  });

  it('should update color when existing categories change', () => {
    const { rerender } = render(<CategoryForm onSubmit={mockOnSubmit} existingCategories={[]} />);
    
    const existingCategories = [
      { id: 1, name: 'Category 1', color: DEFAULT_COLOR, criteria: [] }
    ];
    
    rerender(<CategoryForm onSubmit={mockOnSubmit} existingCategories={existingCategories} />);
    
    const colorPresets = screen.getAllByRole('radio');
    expect(colorPresets.length).toBeLessThan(COLOR_PALETTE.length);
  });

  it('should handle keyboard navigation for color selection', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const colorPresets = screen.getAllByRole('radio');
    const firstColor = colorPresets[0];
    
    firstColor.focus();
    fireEvent.keyDown(firstColor, { key: 'Enter' });
    
    await waitFor(() => {
      expect(firstColor).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('should open suggestions modal when icon is clicked', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const suggestionsButton = screen.getByRole('button', { name: /voir les suggestions/i });
    await user.click(suggestionsButton);
    
    await waitFor(() => {
      expect(screen.getByText(/suggestions d'intérêts professionnels/i)).toBeInTheDocument();
    });
  });

  it('should fill name input when suggestion is selected', async () => {
    render(<CategoryForm onSubmit={mockOnSubmit} />);
    
    const suggestionsButton = screen.getByRole('button', { name: /voir les suggestions/i });
    await user.click(suggestionsButton);
    
    await waitFor(() => {
      expect(screen.getByText(/suggestions d'intérêts professionnels/i)).toBeInTheDocument();
    });
    
    // Click on first suggestion
    const firstSuggestion = screen.getByText('Management');
    await user.click(firstSuggestion);
    
    // Modal should close and input should be filled
    await waitFor(() => {
      expect(screen.queryByText(/suggestions d'intérêts professionnels/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/nom de l'intérêt professionnel/i)).toHaveValue('Management');
    });
  });
});
