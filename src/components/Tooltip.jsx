import React, { useState, useRef, useEffect } from 'react';

/**
 * Composant Tooltip personnalisé avec un design moderne
 * S'adapte à la largeur disponible pour une meilleure lisibilité
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

            // Ajuster la position pour éviter de sortir de l'écran
            let left = tooltip.style.left;
            let top = tooltip.style.top;

            // Pour les tooltips top/bottom, ajuster horizontalement
            if (position === 'top' || position === 'bottom') {
                const tooltipLeft = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                if (tooltipLeft < 10) {
                    tooltip.style.left = '10px';
                    tooltip.style.transform = 'translateX(0)';
                } else if (tooltipLeft + tooltipRect.width > viewportWidth - 10) {
                    tooltip.style.left = 'auto';
                    tooltip.style.right = '10px';
                    tooltip.style.transform = 'translateX(0)';
                }
            }

            // Pour les tooltips left/right, ajuster verticalement
            if (position === 'left' || position === 'right') {
                const tooltipTop = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                if (tooltipTop < 10) {
                    tooltip.style.top = '10px';
                    tooltip.style.transform = 'translateY(0)';
                } else if (tooltipTop + tooltipRect.height > viewportHeight - 10) {
                    tooltip.style.top = 'auto';
                    tooltip.style.bottom = '10px';
                    tooltip.style.transform = 'translateY(0)';
                }
            }

            // Limiter la largeur maximale selon l'espace disponible
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

    // Traiter le contenu pour ajouter des retours à la ligne après chaque point
    const formatContent = (text) => {
        if (typeof text !== 'string') {
            return text;
        }
        // Remplacer chaque point suivi d'un espace par un point + retour à la ligne
        // Mais pas les points qui sont déjà en fin de ligne ou suivis d'un autre point
        return text.replace(/\.\s+/g, '.\n').trim();
    };

    const formattedContent = formatContent(content);

    return (
        <div
            ref={wrapperRef}
            className="tooltip-wrapper"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div ref={tooltipRef} className={`tooltip tooltip-${position}`}>
                    {formattedContent}
                </div>
            )}
        </div>
    );
}

export default Tooltip;
