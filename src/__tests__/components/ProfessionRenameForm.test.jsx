import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfessionRenameForm from '../../components/forms/ProfessionRenameForm';

describe('ProfessionRenameForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    window.alert = vi.fn();
  });

  it('should call onSubmit with trimmed name when creating', async () => {
    render(
      <ProfessionRenameForm
        profession={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/nom du métier/i);
    const submitButton = screen.getByRole('button', { name: /créer le métier/i });

    await user.type(nameInput, 'New Profession');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('New Profession');
  });

  it('should call onSubmit with trimmed name when renaming', async () => {
    const profession = { id: 1, name: 'Old Name', created_at: new Date().toISOString() };

    render(
      <ProfessionRenameForm
        profession={profession}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/nom du métier/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });

    await user.clear(nameInput);
    await user.type(nameInput, '  Updated Name  ');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('Updated Name');
  });

  it('should show alert when name is empty', async () => {
    render(
      <ProfessionRenameForm
        profession={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/nom du métier/i);
    const submitButton = screen.getByRole('button', { name: /créer le métier/i });

    await user.clear(nameInput);
    const form = submitButton.closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    expect(window.alert).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(
      <ProfessionRenameForm
        profession={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
