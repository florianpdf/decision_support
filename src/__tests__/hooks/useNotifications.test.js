import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '../../hooks/useNotifications';
import { NOTIFICATION_DURATION } from '../../utils/constants';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with no message or error', () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.message).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should show success message', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showSuccess('Test success message');
    });

    expect(result.current.message).toBe('Test success message');
    expect(result.current.error).toBeNull();
  });

  it('should show error message', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showError('Test error message');
    });

    expect(result.current.error).toBe('Test error message');
    expect(result.current.message).toBeNull();
  });

  it('should clear error when showing success', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showError('Error');
      result.current.showSuccess('Success');
    });

    expect(result.current.message).toBe('Success');
    expect(result.current.error).toBeNull();
  });

  it('should clear message when showing error', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showSuccess('Success');
      result.current.showError('Error');
    });

    expect(result.current.error).toBe('Error');
    expect(result.current.message).toBeNull();
  });

  it('should clear message after duration', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showSuccess('Test message');
    });

    expect(result.current.message).toBe('Test message');

    act(() => {
      vi.advanceTimersByTime(NOTIFICATION_DURATION + 250);
    });

    expect(result.current.message).toBeNull();
  });

  it('should clear error after duration', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showError('Test error');
    });

    expect(result.current.error).toBe('Test error');

    act(() => {
      vi.advanceTimersByTime(NOTIFICATION_DURATION + 250);
    });

    expect(result.current.error).toBeNull();
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showSuccess('Success');
      result.current.showError('Error');
      result.current.clearAll();
    });

    expect(result.current.message).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle multiple messages correctly', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.showSuccess('First message');
    });

    expect(result.current.message).toBe('First message');

    act(() => {
      vi.advanceTimersByTime(NOTIFICATION_DURATION / 2);
      result.current.showSuccess('Second message');
    });

    expect(result.current.message).toBe('Second message');

    act(() => {
      vi.advanceTimersByTime(NOTIFICATION_DURATION + 250);
    });

    expect(result.current.message).toBeNull();
  });
});
