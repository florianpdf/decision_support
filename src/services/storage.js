/**
 * Service de gestion du stockage local (localStorage)
 * Structure: métiers avec leurs intérêts professionnels et critères
 * Les intérêts pro et critères sont partagés entre tous les métiers
 * Les poids des critères sont spécifiques à chaque métier
 */

// Storage keys
const METIERS_STORAGE_KEY = 'bulle_chart_metiers';
const CATEGORIES_STORAGE_KEY = 'bulle_chart_categories';
const CRITERES_STORAGE_KEY = 'bulle_chart_criteres';
const CRITERE_WEIGHTS_STORAGE_KEY = 'bulle_chart_critere_weights';
const NEXT_METIER_ID_KEY = 'bulle_chart_next_metier_id';
const NEXT_CATEGORY_ID_KEY = 'bulle_chart_next_category_id';
const NEXT_CRITERE_ID_KEY = 'bulle_chart_next_critere_id';

// ==================== METIERS ====================

/**
 * Charge les métiers depuis localStorage
 */
export const loadMetiers = () => {
    try {
        const data = localStorage.getItem(METIERS_STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors du chargement des métiers:', error);
        return [];
    }
};

/**
 * Sauvegarde les métiers dans localStorage
 */
export const saveMetiers = (metiers) => {
    try {
        localStorage.setItem(METIERS_STORAGE_KEY, JSON.stringify(metiers));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des métiers:', error);
        return false;
    }
};

/**
 * Récupère le prochain ID de métier disponible
 */
export const getNextMetierId = () => {
    try {
        const nextId = parseInt(localStorage.getItem(NEXT_METIER_ID_KEY) || '1', 10);
        return isNaN(nextId) ? 1 : nextId;
    } catch (error) {
        return 1;
    }
};

/**
 * Met à jour le prochain ID de métier
 */
export const setNextMetierId = (id) => {
    try {
        localStorage.setItem(NEXT_METIER_ID_KEY, id.toString());
    } catch (error) {
        console.error('Erreur lors de la mise à jour du nextMetierId:', error);
    }
};

/**
 * Ajoute un nouveau métier
 */
export const addMetier = (metier) => {
    const metiers = loadMetiers();
    const nextId = getNextMetierId();
    
    const newMetier = {
        id: nextId,
        nom: metier.nom.trim(),
        created_at: new Date().toISOString(),
    };
    
    metiers.push(newMetier);
    saveMetiers(metiers);
    setNextMetierId(nextId + 1);
    
    return newMetier;
};

/**
 * Met à jour un métier
 */
export const updateMetier = (id, updates) => {
    const metiers = loadMetiers();
    const index = metiers.findIndex(m => m.id === id);
    
    if (index === -1) {
        return null;
    }
    
    if (updates.nom !== undefined) {
        metiers[index].nom = updates.nom.trim();
    }
    
    saveMetiers(metiers);
    return metiers[index];
};

/**
 * Supprime un métier
 */
export const deleteMetier = (id) => {
    const metiers = loadMetiers();
    const filtered = metiers.filter(m => m.id !== id);
    saveMetiers(filtered);
    
    // Supprime aussi les poids associés à ce métier
    const weights = loadCritereWeights();
    const filteredWeights = weights.filter(w => w.metierId !== id);
    saveCritereWeights(filteredWeights);
    
    return true;
};

// ==================== CATEGORIES (Intérêts professionnels) ====================

/**
 * Charge les catégories depuis localStorage
 */
export const loadCategories = () => {
    try {
        const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        return [];
    }
};

/**
 * Sauvegarde les catégories dans localStorage
 */
export const saveCategories = (categories) => {
    try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des catégories:', error);
        return false;
    }
};

/**
 * Récupère le prochain ID de catégorie disponible
 */
export const getNextCategoryId = () => {
    try {
        const nextId = parseInt(localStorage.getItem(NEXT_CATEGORY_ID_KEY) || '1', 10);
        return isNaN(nextId) ? 1 : nextId;
    } catch (error) {
        return 1;
    }
};

/**
 * Met à jour le prochain ID de catégorie
 */
export const setNextCategoryId = (id) => {
    try {
        localStorage.setItem(NEXT_CATEGORY_ID_KEY, id.toString());
    } catch (error) {
        console.error('Erreur lors de la mise à jour du nextCategoryId:', error);
    }
};

/**
 * Ajoute une nouvelle catégorie (partagée entre tous les métiers)
 */
export const addCategory = (category) => {
    const categories = loadCategories();
    const nextId = getNextCategoryId();
    
    const newCategory = {
        id: nextId,
        nom: category.nom.trim(),
        couleur: category.couleur,
        critereIds: [], // Liste des IDs de critères associés
        created_at: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    saveCategories(categories);
    setNextCategoryId(nextId + 1);
    
    return newCategory;
};

/**
 * Met à jour une catégorie (modifie pour tous les métiers)
 */
export const updateCategory = (id, updates) => {
    const categories = loadCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
        return null;
    }
    
    if (updates.nom !== undefined) {
        categories[index].nom = updates.nom.trim();
    }
    if (updates.couleur !== undefined) {
        categories[index].couleur = updates.couleur;
    }
    
    saveCategories(categories);
    return categories[index];
};

/**
 * Supprime une catégorie (supprime pour tous les métiers)
 */
export const deleteCategory = (id) => {
    const categories = loadCategories();
    const category = categories.find(c => c.id === id);
    
    if (!category) {
        return false;
    }
    
    // Supprime les critères associés
    const criteres = loadCriteres();
    const criteresToDelete = criteres.filter(c => category.critereIds.includes(c.id));
    criteresToDelete.forEach(critere => {
        deleteCritere(critere.id);
    });
    
    // Supprime la catégorie
    const filtered = categories.filter(c => c.id !== id);
    saveCategories(filtered);
    
    return true;
};

// ==================== CRITERES (Motivations clés) ====================

/**
 * Charge les critères depuis localStorage
 */
export const loadCriteres = () => {
    try {
        const data = localStorage.getItem(CRITERES_STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors du chargement des critères:', error);
        return [];
    }
};

/**
 * Sauvegarde les critères dans localStorage
 */
export const saveCriteres = (criteres) => {
    try {
        localStorage.setItem(CRITERES_STORAGE_KEY, JSON.stringify(criteres));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des critères:', error);
        return false;
    }
};

/**
 * Récupère le prochain ID de critère disponible
 */
export const getNextCritereId = () => {
    try {
        const nextId = parseInt(localStorage.getItem(NEXT_CRITERE_ID_KEY) || '1', 10);
        return isNaN(nextId) ? 1 : nextId;
    } catch (error) {
        return 1;
    }
};

/**
 * Met à jour le prochain ID de critère
 */
export const setNextCritereId = (id) => {
    try {
        localStorage.setItem(NEXT_CRITERE_ID_KEY, id.toString());
    } catch (error) {
        console.error('Erreur lors de la mise à jour du nextCritereId:', error);
    }
};

/**
 * Ajoute un nouveau critère (partagé entre tous les métiers)
 */
export const addCritere = (categoryId, critere) => {
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
        return null;
    }
    
    const criteres = loadCriteres();
    const nextId = getNextCritereId();
    const newCritere = {
        id: nextId,
        nom: critere.nom.trim(),
        categoryId: categoryId,
        created_at: new Date().toISOString(),
    };
    
    criteres.push(newCritere);
    saveCriteres(criteres);
    setNextCritereId(nextId + 1);
    
    // Ajoute le critère à la catégorie
    if (!categories[categoryIndex].critereIds) {
        categories[categoryIndex].critereIds = [];
    }
    categories[categoryIndex].critereIds.push(nextId);
    saveCategories(categories);
    
    return newCritere;
};

/**
 * Met à jour un critère (modifie pour tous les métiers)
 */
export const updateCritere = (critereId, updates) => {
    const criteres = loadCriteres();
    const index = criteres.findIndex(c => c.id === critereId);
    
    if (index === -1) {
        return null;
    }
    
    if (updates.nom !== undefined) {
        criteres[index].nom = updates.nom.trim();
    }
    
    saveCriteres(criteres);
    return criteres[index];
};

/**
 * Supprime un critère (supprime pour tous les métiers)
 */
export const deleteCritere = (critereId) => {
    const criteres = loadCriteres();
    const critere = criteres.find(c => c.id === critereId);
    
    if (!critere) {
        return false;
    }
    
    // Supprime le critère de la catégorie
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === critere.categoryId);
    if (categoryIndex !== -1) {
        if (!categories[categoryIndex].critereIds) {
            categories[categoryIndex].critereIds = [];
        }
        categories[categoryIndex].critereIds = categories[categoryIndex].critereIds.filter(
            id => id !== critereId
        );
        saveCategories(categories);
    }
    
    // Supprime les poids associés à ce critère
    const weights = loadCritereWeights();
    const filteredWeights = weights.filter(w => w.critereId !== critereId);
    saveCritereWeights(filteredWeights);
    
    // Supprime le critère
    const filtered = criteres.filter(c => c.id !== critereId);
    saveCriteres(filtered);
    
    return true;
};

// ==================== CRITERE WEIGHTS (Poids spécifiques par métier) ====================

/**
 * Charge les poids des critères depuis localStorage
 * Structure: [{ metierId, categoryId, critereId, poids }]
 */
export const loadCritereWeights = () => {
    try {
        const data = localStorage.getItem(CRITERE_WEIGHTS_STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors du chargement des poids:', error);
        return [];
    }
};

/**
 * Sauvegarde les poids des critères dans localStorage
 */
export const saveCritereWeights = (weights) => {
    try {
        localStorage.setItem(CRITERE_WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des poids:', error);
        return false;
    }
};

/**
 * Récupère le poids d'un critère pour un métier donné
 */
export const getCritereWeight = (metierId, critereId) => {
    const weights = loadCritereWeights();
    const weight = weights.find(w => w.metierId === metierId && w.critereId === critereId);
    return weight ? weight.poids : 15; // Défaut: 15
};

/**
 * Met à jour le poids d'un critère pour un métier donné
 */
export const setCritereWeight = (metierId, categoryId, critereId, poids) => {
    const weights = loadCritereWeights();
    const index = weights.findIndex(
        w => w.metierId === metierId && w.critereId === critereId
    );
    
    const weightData = {
        metierId,
        categoryId,
        critereId,
        poids: parseFloat(poids),
    };
    
    if (index === -1) {
        weights.push(weightData);
    } else {
        weights[index] = weightData;
    }
    
    saveCritereWeights(weights);
    return weightData;
};

/**
 * Initialise les poids pour un nouveau métier (copie du dernier métier créé)
 */
export const initializeMetierWeights = (newMetierId, sourceMetierId) => {
    const sourceWeights = loadCritereWeights().filter(w => w.metierId === sourceMetierId);
    const weights = loadCritereWeights();
    
    sourceWeights.forEach(weight => {
        weights.push({
            metierId: newMetierId,
            categoryId: weight.categoryId,
            critereId: weight.critereId,
            poids: weight.poids,
        });
    });
    
    saveCritereWeights(weights);
    return weights.filter(w => w.metierId === newMetierId);
};

/**
 * Migrate old data structure to new structure
 */
const migrateOldData = () => {
    const categories = loadCategories();
    let needsMigration = false;
    
    const migratedCategories = categories.map(category => {
        // If category has old structure (criteres array), migrate it
        if (category.criteres && Array.isArray(category.criteres) && category.criteres.length > 0 && !category.critereIds) {
            needsMigration = true;
            
            // Migrate criteres to separate storage
            const criteres = loadCriteres();
            const weights = loadCritereWeights();
            const metiers = loadMetiers();
            
            category.criteres.forEach(oldCritere => {
                // Check if critere already exists
                const existingCritere = criteres.find(c => c.id === oldCritere.id);
                if (!existingCritere) {
                    criteres.push({
                        id: oldCritere.id,
                        nom: oldCritere.nom,
                        categoryId: category.id,
                        created_at: oldCritere.created_at || new Date().toISOString(),
                    });
                }
                
                // Migrate weights for all metiers
                metiers.forEach(metier => {
                    const existingWeight = weights.find(
                        w => w.metierId === metier.id && w.critereId === oldCritere.id
                    );
                    if (!existingWeight) {
                        weights.push({
                            metierId: metier.id,
                            categoryId: category.id,
                            critereId: oldCritere.id,
                            poids: oldCritere.poids || 15,
                        });
                    }
                });
            });
            
            saveCriteres(criteres);
            saveCritereWeights(weights);
            
            // Return migrated category
            return {
                ...category,
                critereIds: category.criteres.map(c => c.id).filter(id => id),
                criteres: undefined // Remove old criteres array
            };
        }
        
        // Ensure critereIds exists
        if (!category.critereIds) {
            needsMigration = true;
            return {
                ...category,
                critereIds: []
            };
        }
        
        return category;
    });
    
    if (needsMigration) {
        saveCategories(migratedCategories);
    }
    
    return migratedCategories;
};

/**
 * Récupère toutes les catégories avec leurs critères et poids pour un métier donné
 */
export const getCategoriesForMetier = (metierId) => {
    if (!metierId) {
        return [];
    }
    
    // Migrate old data if needed
    const categories = migrateOldData();
    const criteres = loadCriteres();
    const weights = loadCritereWeights();
    
    return categories.map(category => {
        const critereIds = category.critereIds || [];
        const categoryCriteres = critereIds
            .map(critereId => {
                const critere = criteres.find(c => c.id === critereId);
                if (!critere) return null;
                
                const weight = weights.find(
                    w => w.metierId === metierId && w.critereId === critereId
                );
                
                return {
                    ...critere,
                    poids: weight ? weight.poids : 15, // Défaut: 15
                };
            })
            .filter(c => c !== null);
        
        return {
            ...category,
            criteres: categoryCriteres,
        };
    });
};

/**
 * Calcule le poids total d'une catégorie pour un métier donné
 */
export const getCategoryTotalWeight = (category, metierId) => {
    if (!category || !category.criteres || category.criteres.length === 0) {
        return 0;
    }
    return category.criteres.reduce((sum, critere) => sum + (critere.poids || 15), 0);
};
