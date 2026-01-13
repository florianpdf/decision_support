import React, { useState, useRef, useEffect } from 'react';

/**
 * Custom Tooltip component with modern design
 * Adapts to available width for better readability
 */
function Tooltip({ children, content, position = 'top' }) {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (isVisible && tooltipRef.current && wrapperRef.current) {
            const tooltip = tooltipRef.current;
            const wrapper = wrapperRef.current;
            const rect = wrapper.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Use fixed position to avoid z-index issues
            tooltip.style.position = 'fixed';
            tooltip.style.zIndex = '10000';

            // Calculate position relative to viewport
            if (position === 'top') {
                const left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                const top = rect.top - tooltipRect.height - 8;
                
                tooltip.style.left = `${Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10))}px`;
                tooltip.style.top = `${Math.max(10, top)}px`;
                tooltip.style.transform = 'translateX(0)';
            } else if (position === 'bottom') {
                const left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                const top = rect.bottom + 8;
                
                tooltip.style.left = `${Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10))}px`;
                tooltip.style.top = `${Math.min(top, viewportHeight - tooltipRect.height - 10)}px`;
                tooltip.style.transform = 'translateX(0)';
            } else if (position === 'left') {
                const left = rect.left - tooltipRect.width - 8;
                const top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                
                tooltip.style.left = `${Math.max(10, left)}px`;
                tooltip.style.top = `${Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10))}px`;
                tooltip.style.transform = 'translateY(0)';
            } else if (position === 'right') {
                const left = rect.right + 8;
                const top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                
                tooltip.style.left = `${Math.min(left, viewportWidth - tooltipRect.width - 10)}px`;
                tooltip.style.top = `${Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10))}px`;
                tooltip.style.transform = 'translateY(0)';
            }

            // Limit max width based on available space
            if (position === 'top' || position === 'bottom') {
                const availableWidth = Math.min(viewportWidth - 20, 400);
                tooltip.style.maxWidth = `${availableWidth}px`;
            } else {
                const availableWidth = Math.min(viewportWidth - rect.width - 40, 400);
                tooltip.style.maxWidth = `${availableWidth}px`;
            }
        }
    }, [isVisible, position]);

    if (!content) {
        return children;
    }

    // Process content to add line breaks after each period
    const formattedContent = React.useMemo(() => {
        if (typeof content !== 'string') {
            return content;
        }
        // Replace each period followed by space with period + line break
        // But not periods that are already at end of line or followed by another period
        return content.replace(/\.\s+/g, '.\n').trim();
    }, [content]);

    return (
        <div
            ref={wrapperRef}
            className="tooltip-wrapper"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div 
                    ref={tooltipRef} 
                    className={`tooltip tooltip-${position}`}
                >
                    {formattedContent}
                </div>
            )}
        </div>
    );
}

export default React.memo(Tooltip);
