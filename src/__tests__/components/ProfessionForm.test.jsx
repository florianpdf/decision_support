import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfessionForm from '../../components/forms/ProfessionForm';

describe('ProfessionForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    window.alert = vi.fn();
  });

  it('should render form', () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/nom du métier/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer le métier/i })).toBeInTheDocument();
  });

  it('should call onSubmit with trimmed name', async () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/nom du métier/i);
    const submitButton = screen.getByRole('button', { name: /créer le métier/i });

    await user.type(nameInput, '  Test Profession  ');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Profession',
      useTemplate: false
    });
  });

  it('should show alert when name is empty', async () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /créer le métier/i });
    const form = submitButton.closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    expect(window.alert).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should not show cancel button when onCancel is not provided', () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByRole('button', { name: /annuler/i })).not.toBeInTheDocument();
  });

  it('should show template checkbox when isFirstProfession is true', () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isFirstProfession={true}
      />
    );

    expect(screen.getByLabelText(/utiliser un modèle/i)).toBeInTheDocument();
  });

  it('should not show template checkbox when isFirstProfession is false', () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isFirstProfession={false}
      />
    );

    expect(screen.queryByLabelText(/utiliser un modèle/i)).not.toBeInTheDocument();
  });

  it('should include useTemplate in onSubmit when checkbox is checked', async () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isFirstProfession={true}
      />
    );

    const nameInput = screen.getByLabelText(/nom du métier/i);
    const templateCheckbox = screen.getByLabelText(/utiliser un modèle/i);
    const submitButton = screen.getByRole('button', { name: /créer le métier/i });

    await user.type(nameInput, 'Test Profession');
    await user.click(templateCheckbox);
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Profession',
      useTemplate: true
    });
  });

  it('should reset form after submission', async () => {
    render(
      <ProfessionForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isFirstProfession={true}
      />
    );

    const nameInput = screen.getByLabelText(/nom du métier/i);
    const templateCheckbox = screen.getByLabelText(/utiliser un modèle/i);
    const submitButton = screen.getByRole('button', { name: /créer le métier/i });

    await user.type(nameInput, 'Test Profession');
    await user.click(templateCheckbox);
    await user.click(submitButton);

    expect(nameInput).toHaveValue('');
    expect(templateCheckbox).not.toBeChecked();
  });
});
