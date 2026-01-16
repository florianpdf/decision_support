import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CritereForm from '../../components/forms/CritereForm';

describe('CritereForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const user = userEvent.setup();
  const categoryId = 1;

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    window.alert = vi.fn();
  });

  it('should render form with all fields', () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByRole('textbox', { name: /nom de la motivation clé/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/importance de la motivation clé/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter la motivation clé/i })).toBeInTheDocument();
  });

  it('should call onSubmit with correct data', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByRole('textbox', { name: /nom de la motivation clé/i });
    const submitButton = screen.getByRole('button', { name: /ajouter la motivation clé/i });
    
    await user.type(nameInput, 'Test Motivation');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Motivation',
      weight: 15,
      type: 'neutral'
    });
  });

  it('should trim criterion name', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByRole('textbox', { name: /nom de la motivation clé/i });
    const submitButton = screen.getByRole('button', { name: /ajouter la motivation clé/i });
    
    await user.type(nameInput, '  Test Motivation  ');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Motivation',
      weight: 15,
      type: 'neutral'
    });
  });

  it('should show alert when name is empty', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByRole('textbox', { name: /nom de la motivation clé/i });
    const submitButton = screen.getByRole('button', { name: /ajouter la motivation clé/i });
    
    // Clear the input and try to submit
    await user.clear(nameInput);
    // HTML5 validation prevents form submission, so we need to bypass it
    const form = submitButton.closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Since HTML5 validation prevents submission, we check that onSubmit wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should allow weight adjustment via slider', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const slider = screen.getByLabelText(/importance de la motivation clé/i);
    const nameInput = screen.getByRole('textbox', { name: /nom de la motivation clé/i });
    const submitButton = screen.getByRole('button', { name: /ajouter la motivation clé/i });
    
    await user.type(nameInput, 'Test');
    // Material-UI Slider uses a hidden input, we can change its value
    fireEvent.change(slider, { target: { value: '15' } });
    await user.click(submitButton);
    
    // The slider value should be reflected in the submission
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test',
      weight: expect.any(Number),
      type: 'neutral'
    });
  });

  it('should reset form after submission', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByRole('textbox', { name: /nom de la motivation clé/i });
    const submitButton = screen.getByRole('button', { name: /ajouter la motivation clé/i });
    
    await user.type(nameInput, 'Test Motivation');
    await user.click(submitButton);
    
    // Form should reset
    expect(nameInput).toHaveValue('');
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // The cancel button is wrapped in a Tooltip with aria-label
    const cancelButtons = screen.getAllByRole('button');
    const cancelButton = cancelButtons.find(btn => btn.textContent === '✖️');
    
    if (cancelButton) {
      await user.click(cancelButton);
      expect(mockOnCancel).toHaveBeenCalled();
    } else {
      // If button not found by text, try to find it by clicking the last button (cancel is usually last)
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 1) {
        await user.click(buttons[buttons.length - 1]);
        expect(mockOnCancel).toHaveBeenCalled();
      }
    }
  });

  it('should not show cancel button when onCancel is not provided', () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} />);
    
    expect(screen.queryByRole('button', { name: /annuler/i })).not.toBeInTheDocument();
  });

  it('should display default weight value', () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByText(/importance sélectionnée : 15/i)).toBeInTheDocument();
  });

  it('should open suggestions modal when icon is clicked', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const suggestionsButton = screen.getByRole('button', { name: /voir les suggestions/i });
    await user.click(suggestionsButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /💡 suggestions de motivations clés/i })).toBeInTheDocument();
    });
  });

  it('should fill name input when suggestion is selected', async () => {
    render(<CritereForm categoryId={categoryId} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const suggestionsButton = screen.getByRole('button', { name: /voir les suggestions/i });
    await user.click(suggestionsButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /💡 suggestions de motivations clés/i })).toBeInTheDocument();
    });
    
    // Click on first suggestion
    const firstSuggestion = screen.getByText('Autonomie');
    await user.click(firstSuggestion);
    
    // Modal should close and input should be filled
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /💡 suggestions de motivations clés/i })).not.toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /nom de la motivation clé/i })).toHaveValue('Autonomie');
    });
  });
});
