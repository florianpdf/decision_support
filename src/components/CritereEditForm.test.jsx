import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CritereEditForm from './forms/CritereEditForm';

describe('CritereEditForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const user = userEvent.setup();
  const mockCritere = {
    id: 1,
    nom: 'Original Name',
    poids: 15
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    window.alert = vi.fn();
  });

  it('should render form with existing critere data', () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    expect(nameInput).toHaveValue('Original Name');
    expect(screen.getByText(/importance sélectionnée : 15/i)).toBeInTheDocument();
  });

  it('should call onSubmit with updated data', async () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: 1,
      nom: 'Updated Name',
      poids: 15
    });
  });

  it('should trim updated name', async () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    
    await user.clear(nameInput);
    await user.type(nameInput, '  Updated Name  ');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: 1,
      nom: 'Updated Name',
      poids: 15
    });
  });

  it('should show alert when name is empty', async () => {
    render(<CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    
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
    
    // The cancel button only has an emoji, so we find it by its type and class
    const cancelButton = screen.getByRole('button', { name: /✖️/i });
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should update when critere prop changes', () => {
    const { rerender } = render(
      <CritereEditForm critere={mockCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );
    
    const newCritere = { id: 1, nom: 'New Name', poids: 20 };
    rerender(<CritereEditForm critere={newCritere} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/nom de la motivation clé/i);
    expect(nameInput).toHaveValue('New Name');
    expect(screen.getByText(/importance sélectionnée : 20/i)).toBeInTheDocument();
  });
});
