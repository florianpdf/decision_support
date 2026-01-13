import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmModal from '../../components/modals/ConfirmModal';

describe('ConfirmModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
  });

  it('should return null when not open', () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when open', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when overlay is clicked', async () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    const overlay = screen.getByText('Test Title').closest('.modal-overlay');
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not call onClose when content is clicked', async () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
      />
    );

    const content = screen.getByText('Test Title');
    await user.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should display custom button texts', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
        confirmText="Delete"
        cancelText="Cancel"
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should show checkbox when requireCheckbox is true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
        requireCheckbox={true}
        checkboxLabel="I understand"
      />
    );

    const checkbox = screen.getByLabelText(/i understand/i);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('should disable confirm button when checkbox is required and not checked', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
        requireCheckbox={true}
        checkboxLabel="I understand"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    expect(confirmButton).toBeDisabled();
  });

  it('should enable confirm button when checkbox is checked', async () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
        requireCheckbox={true}
        checkboxLabel="I understand"
      />
    );

    const checkbox = screen.getByLabelText(/i understand/i);
    await user.click(checkbox);

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('should not call onConfirm when checkbox is required and not checked', async () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
        requireCheckbox={true}
        checkboxLabel="I understand"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    // Button should be disabled, but try clicking anyway
    await user.click(confirmButton);

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should reset checkbox when confirm is clicked', async () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Title"
        message="Test Message"
        requireCheckbox={true}
        checkboxLabel="I understand"
      />
    );

    const checkbox = screen.getByLabelText(/i understand/i);
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    const confirmButton = screen.getByRole('button', { name: /confirmer/i });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalled();
    // Checkbox should be reset after confirm
    const newCheckbox = screen.queryByLabelText(/i understand/i);
    if (newCheckbox) {
      expect(newCheckbox).not.toBeChecked();
    }
  });
});
