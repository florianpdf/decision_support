/**
 * Custom hook for managing notifications (messages and errors)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { NOTIFICATION_DURATION } from '../utils/constants';

/**
 * Hook for managing notifications
 * @returns {Object} Notification state and handlers
 */
export const useNotifications = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [displayMessage, setDisplayMessage] = useState(null);
  const [displayError, setDisplayError] = useState(null);
  const messageTimeoutRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  /**
   * Clear message after duration with exit transition
   */
  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      // Clear previous timeout
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      // Start exit transition before removing
      messageTimeoutRef.current = setTimeout(() => {
        setDisplayMessage(null);
        // Small delay to allow exit animation
        setTimeout(() => setMessage(null), 250);
      }, NOTIFICATION_DURATION);
      return () => {
        if (messageTimeoutRef.current) {
          clearTimeout(messageTimeoutRef.current);
        }
      };
    } else {
      setDisplayMessage(null);
    }
  }, [message]);

  /**
   * Clear error after duration with exit transition
   */
  useEffect(() => {
    if (error) {
      setDisplayError(error);
      // Clear previous timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      // Start exit transition before removing
      errorTimeoutRef.current = setTimeout(() => {
        setDisplayError(null);
        // Small delay to allow exit animation
        setTimeout(() => setError(null), 250);
      }, NOTIFICATION_DURATION);
      return () => {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
      };
    } else {
      setDisplayError(null);
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
    message: displayMessage,
    error: displayError,
    showSuccess,
    showError,
    clearAll
  };
};
