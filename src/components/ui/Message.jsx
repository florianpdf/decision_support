import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Message component for notifications
 */
const Message = ({ type, children, className = '', ...props }) => {
  const typeClass = type === 'error' ? 'message-error' : 'message-success';
  const role = type === 'error' ? 'alert' : 'status';
  const ariaLive = type === 'error' ? 'assertive' : 'polite';

  return (
    <div
      className={`message ${typeClass} ${className}`}
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
