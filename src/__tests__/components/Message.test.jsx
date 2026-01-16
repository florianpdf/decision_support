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
});
