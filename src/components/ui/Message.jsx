import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Message component for notifications
 * Handles smooth enter/exit transitions
 */
const Message = ({ type, children, className = '', ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const typeClass = type === 'error' ? 'message-error' : 'message-success';
  const role = type === 'error' ? 'alert' : 'status';
  const ariaLive = type === 'error' ? 'assertive' : 'polite';

  // Trigger visibility animation on mount
  useEffect(() => {
    // Small delay to trigger CSS animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`message ${typeClass} ${isVisible ? 'message-visible' : 'message-entering'} ${className}`}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      {...props}
    >
      {children}
    </div>
  );
};

Message.propTypes = {
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default React.memo(Message);
