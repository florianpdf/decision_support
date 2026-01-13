import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Message from '../../components/ui/Message';

describe('Message', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render success message', () => {
    render(<Message type="success">Test message</Message>);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<Message type="error">Error message</Message>);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have correct aria-live attribute for success', () => {
    render(<Message type="success">Test</Message>);
    const message = screen.getByRole('status');
    expect(message).toHaveAttribute('aria-live', 'polite');
  });

  it('should have correct aria-live attribute for error', () => {
    render(<Message type="error">Test</Message>);
    const message = screen.getByRole('alert');
    expect(message).toHaveAttribute('aria-live', 'assertive');
  });

  it('should apply custom className', () => {
    render(<Message type="success" className="custom-class">Test</Message>);
    const message = screen.getByRole('status');
    expect(message.className).toContain('custom-class');
  });

  it('should trigger visibility animation', () => {
    render(<Message type="success">Test</Message>);
    const message = screen.getByRole('status');
    
    // Initially should have entering class
    expect(message.className).toContain('message-entering');
    
    // After timeout, state updates to visible
    act(() => {
      vi.advanceTimersByTime(20);
    });
    
    // Re-query to get updated element with new state
    const updatedMessage = screen.getByRole('status');
    // Component should now have visible class after state update
    expect(updatedMessage.className).toContain('message-visible');
  });

  it('should handle exit animation when isExiting is true', () => {
    const { rerender } = render(<Message type="success">Test</Message>);
    
    act(() => {
      vi.advanceTimersByTime(20);
    });
    let message = screen.getByRole('status');
    expect(message.className).toContain('message');
    
    rerender(<Message type="success" isExiting={true}>Test</Message>);
    message = screen.getByRole('status');
    expect(message.className).toContain('message-exiting');
  });

  it('should render children content', () => {
    render(
      <Message type="success">
        <span>Custom content</span>
      </Message>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
