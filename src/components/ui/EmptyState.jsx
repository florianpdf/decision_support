import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable EmptyState component
 */
const EmptyState = ({ title, description, icon, className = '', ...props }) => {
  return (
    <div className={`empty-state ${className}`} {...props}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      {title && <p className="empty-state-title">{title}</p>}
      {description && <p className="empty-state-description">{description}</p>}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string
};

export default React.memo(EmptyState);
