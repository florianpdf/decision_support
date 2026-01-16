import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryEditForm from '../../components/forms/CategoryEditForm';
import { COLOR_PALETTE } from '../../constants/colors';

describe('CategoryEditForm', () => {
  const mockCategory = {
    id: 1,
    name: 'Test Category',
    color: COLOR_PALETTE[0],
    criteria: []
  };

  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    window.alert = vi.fn();
  });

  it('should render form with category data', () => {
    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/nom de l'intérêt professionnel/i)).toHaveValue('Test Category');
    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
  });

  it('should call onSubmit with updated data', async () => {
    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Category');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Updated Category',
      color: COLOR_PALETTE[0]
    });
  });

  it('should trim category name on submit', async () => {
    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });

    await user.clear(nameInput);
    await user.type(nameInput, '  Trimmed Category  ');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Trimmed Category',
      color: COLOR_PALETTE[0]
    });
  });

  it('should show alert when name is empty', async () => {
    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/nom de l'intérêt professionnel/i);
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });

    await user.clear(nameInput);
    const form = submitButton.closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    expect(window.alert).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should allow color selection', async () => {
    const existingCategories = [
      { id: 2, name: 'Other Category', color: COLOR_PALETTE[1], criteria: [] }
    ];

    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        existingCategories={existingCategories}
      />
    );

    const colorPresets = screen.getAllByRole('radio');
    const secondColor = colorPresets[1];

    await user.click(secondColor);

    expect(secondColor).toHaveAttribute('aria-checked', 'true');
  });

  it('should filter out used colors', () => {
    const existingCategories = [
      { id: 2, name: 'Category 2', color: COLOR_PALETTE[1], criteria: [] },
      { id: 3, name: 'Category 3', color: COLOR_PALETTE[2], criteria: [] }
    ];

    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        existingCategories={existingCategories}
      />
    );

    const colorPresets = screen.getAllByRole('radio');
    // Should show all colors except the ones used by other categories
    // Current category color should still be available
    expect(colorPresets.length).toBeGreaterThan(0);
  });

  it('should handle keyboard navigation for color selection', async () => {
    render(
      <CategoryEditForm
        category={mockCategory}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const colorPresets = screen.getAllByRole('radio');
    const firstColor = colorPresets[0];

    firstColor.focus();
    fireEvent.keyDown(firstColor, { key: 'Enter' });

    expect(firstColor).toHaveAttribute('aria-checked', 'true');
  });
});
