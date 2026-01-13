import React, { useMemo } from 'react';
import { getCategoryTotalWeight } from '../../services/storage';
import { CRITERION_TYPE_COLORS, CRITERION_TYPE_LABELS, CRITERION_TYPES } from '../../utils/constants';

/**
 * Legend component displaying categories or criterion types based on color mode
 */
function Legend({ categories, colorMode = 'category', professionId, compact = false }) {
    // Filter categories that have at least one criterion
    const categoriesWithCriteria = categories.filter(cat => 
        cat.criteria && cat.criteria.length > 0
    );

    // Calculate type statistics when in type mode
    const typeStats = useMemo(() => {
        if (colorMode !== 'type') return null;
        
        const stats = {};
        Object.values(CRITERION_TYPES).forEach(type => {
            stats[type] = {
                count: 0,
                totalWeight: 0
            };
        });

        categoriesWithCriteria.forEach(category => {
            if (category.criteria) {
                category.criteria.forEach(criterion => {
                    const type = criterion.type || 'neutral';
                    if (stats[type]) {
                        stats[type].count += 1;
                        // criterion.weight is already the correct weight for this profession
                        stats[type].totalWeight += criterion.weight || 0;
                    }
                });
            }
        });

        return stats;
    }, [categoriesWithCriteria, colorMode]);

    if (categoriesWithCriteria.length === 0) {
        return null;
    }

    // Display by type
    if (colorMode === 'type') {
        const typesWithData = Object.values(CRITERION_TYPES).filter(type => 
            typeStats[type] && typeStats[type].count > 0
        );

        if (typesWithData.length === 0) {
            return null;
        }

        return (
            <div className={`legend-integrated ${compact ? 'legend-compact' : ''}`}>
                {typesWithData.map((type) => {
                    const stats = typeStats[type];
                    return (
                        <div key={type} className="legend-category-item">
                            <div
                                className="legend-color-box"
                                style={{ backgroundColor: CRITERION_TYPE_COLORS[type] }}
                            />
                            <div className="legend-category-info">
                                <span className="legend-category-name">{CRITERION_TYPE_LABELS[type]}</span>
                                <span className="legend-category-stats">
                                    {stats.count} motivation{stats.count > 1 ? 's' : ''} clé{stats.count > 1 ? 's' : ''} • Importance: {stats.totalWeight}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Display by category (default)
    return (
        <div className={`legend-integrated ${compact ? 'legend-compact' : ''}`}>
            {categoriesWithCriteria.map((category) => {
                const totalWeight = getCategoryTotalWeight(category, professionId);
                const criteriaCount = category.criteria ? category.criteria.length : 0;
                return (
                    <div key={category.id} className="legend-category-item">
                        <div
                            className="legend-color-box"
                            style={{ backgroundColor: category.color }}
                        />
                        <div className="legend-category-info">
                            <span className="legend-category-name">{category.name}</span>
                            <span className="legend-category-stats">
                                {criteriaCount} motivation{criteriaCount > 1 ? 's' : ''} clé{criteriaCount > 1 ? 's' : ''} • Importance: {totalWeight}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Legend;
