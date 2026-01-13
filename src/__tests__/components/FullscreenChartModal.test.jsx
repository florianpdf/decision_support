import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FullscreenChartModal from '../../components/modals/FullscreenChartModal';

describe('FullscreenChartModal', () => {
  const mockOnClose = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should return null when not open', () => {
    const { container } = render(
      <FullscreenChartModal isOpen={false} onClose={mockOnClose}>
        <div>Test content</div>
      </FullscreenChartModal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when open', () => {
    render(
      <FullscreenChartModal isOpen={true} onClose={mockOnClose}>
        <div>Test content</div>
      </FullscreenChartModal>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    render(
      <FullscreenChartModal isOpen={true} onClose={mockOnClose}>
        <div>Test content</div>
      </FullscreenChartModal>
    );

    const closeButton = screen.getByLabelText(/fermer/i);
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when overlay is clicked', async () => {
    render(
      <FullscreenChartModal isOpen={true} onClose={mockOnClose}>
        <div>Test content</div>
      </FullscreenChartModal>
    );

    const overlay = screen.getByText('Test content').closest('.modal-overlay');
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not call onClose when content is clicked', async () => {
    render(
      <FullscreenChartModal isOpen={true} onClose={mockOnClose}>
        <div>Test content</div>
      </FullscreenChartModal>
    );

    const content = screen.getByText('Test content');
    await user.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render children content', () => {
    render(
      <FullscreenChartModal isOpen={true} onClose={mockOnClose}>
        <div>
          <h2>Chart Title</h2>
          <div>Chart Content</div>
        </div>
      </FullscreenChartModal>
    );

    expect(screen.getByText('Chart Title')).toBeInTheDocument();
    expect(screen.getByText('Chart Content')).toBeInTheDocument();
  });
});
