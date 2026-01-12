/**
 * Custom hook for managing notifications (messages and errors)
 */

import { useState, useCallback, useEffect } from 'react';
import { NOTIFICATION_DURATION } from '../utils/constants';

/**
 * Hook for managing notifications
 * @returns {Object} Notification state and handlers
 */
export const useNotifications = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Clear message after duration
   */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), NOTIFICATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * Clear error after duration
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), NOTIFICATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Show success message
   */
  const showSuccess = useCallback((text) => {
    setMessage(text);
    setError(null);
  }, []);

  /**
   * Show error message
   */
  const showError = useCallback((text) => {
    setError(text);
    setMessage(null);
  }, []);

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  return {
    message,
    error,
    showSuccess,
    showError,
    clearAll
  };
};
