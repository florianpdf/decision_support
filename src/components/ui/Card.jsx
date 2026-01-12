import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Card component
 */
const Card = ({ children, className = '', title, subtitle, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <h2>{title}</h2>
      )}
      {subtitle && (
        <p className="card-subtitle">{subtitle}</p>
      )}
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.string
};

export default React.memo(Card);
