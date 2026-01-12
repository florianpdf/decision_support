import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Stats component for displaying statistics
 */
const Stats = ({ value, label, className = '', ...props }) => {
  return (
    <div className={`stats ${className}`} {...props}>
      <span className="stats-value">{value}</span>
      <span className="stats-label">{label}</span>
    </div>
  );
};

Stats.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default React.memo(Stats);
