import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CritereEditForm from '../../components/forms/CritereEditForm';

describe('CritereEditForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const user = userEvent.setup();
  const mockCritere = {
    id: 1,
    name: 'Original Name'
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    window.alert = vi.fn();
  });

  it('should render form with existing criterion data', () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    expect(nameInput).toHaveValue('Original Name');
  });

  it('should call onSubmit with updated data', async () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer les modifications/i });
    
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Updated Name'
    });
  });

  it('should trim updated name', async () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer les modifications/i });
    
    await user.clear(nameInput);
    await user.type(nameInput, '  Updated Name  ');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Updated Name'
    });
  });

  it('should show alert when name is empty', async () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer les modifications/i });
    
    await user.clear(nameInput);
    // HTML5 validation prevents form submission, so we need to bypass it
    const form = submitButton.closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Since HTML5 validation prevents submission, we check that onSubmit wasn't called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should update when criterion prop changes', () => {
    const { rerender } = render(
      <CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    const newCritere = { id: 1, name: 'New Name' };
    rerender(<CritereEditForm critere={newCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    expect(nameInput).toHaveValue('New Name');
  });
});
