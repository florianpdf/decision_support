import React from 'react';
import { getCategoryTotalWeight } from '../services/storage';

/**
 * Composant légende affichant uniquement les catégories
 */
function Legend({ categories }) {
    // Filtrer les catégories qui ont au moins un critère
    const categoriesWithCriteres = categories.filter(cat => 
        cat.criteres && cat.criteres.length > 0
    );

    if (categoriesWithCriteres.length === 0) {
        return null;
    }

    return (
        <div className="legend-integrated">
            {categoriesWithCriteres.map((category) => {
                const totalWeight = getCategoryTotalWeight(category);
                const criteresCount = category.criteres ? category.criteres.length : 0;
                return (
                    <div key={category.id} className="legend-category-item">
                        <div
                            className="legend-color-box"
                            style={{ backgroundColor: category.couleur }}
                        />
                        <div className="legend-category-info">
                            <span className="legend-category-name">{category.nom}</span>
                            <span className="legend-category-stats">
                                {criteresCount} motivation{criteresCount > 1 ? 's' : ''} clé{criteresCount > 1 ? 's' : ''} • Importance: {totalWeight}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Legend;
