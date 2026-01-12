import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';

/**
 * Reusable IconButton component with tooltip
 */
const IconButton = ({ 
  icon, 
  onClick, 
  tooltip, 
  tooltipPosition = 'top',
  className = '',
  style = {},
  disabled = false,
  ariaLabel,
  ...props 
}) => {
  const button = (
    <button
      className={`btn-icon ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  tooltipPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string
};

export default React.memo(IconButton);
