/**
 * Service de gestion du stockage local (localStorage)
 * Structure: catégories avec leurs critères
 */
const STORAGE_KEY = 'bulle_chart_categories';
const NEXT_CATEGORY_ID_KEY = 'bulle_chart_next_category_id';
const NEXT_CRITERE_ID_KEY = 'bulle_chart_next_critere_id';

/**
 * Charge les catégories depuis localStorage
 */
export const loadCategories = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return [];
        }
        const categories = JSON.parse(data);
        return categories;
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
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
        return nextId;
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
 * Récupère le prochain ID de critère disponible
 */
export const getNextCritereId = () => {
    try {
        const nextId = parseInt(localStorage.getItem(NEXT_CRITERE_ID_KEY) || '1', 10);
        return nextId;
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
 * Ajoute une nouvelle catégorie
 */
export const addCategory = (category) => {
    const categories = loadCategories();
    const nextId = getNextCategoryId();
    
    const newCategory = {
        id: nextId,
        nom: category.nom.trim(),
        couleur: category.couleur,
        criteres: [],
        created_at: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    saveCategories(categories);
    setNextCategoryId(nextId + 1);
    
    return newCategory;
};

/**
 * Met à jour une catégorie
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
 * Supprime une catégorie
 */
export const deleteCategory = (id) => {
    const categories = loadCategories();
    const filtered = categories.filter(c => c.id !== id);
    saveCategories(filtered);
    return true;
};

/**
 * Ajoute un critère à une catégorie
 */
export const addCritereToCategory = (categoryId, critere) => {
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
        return null;
    }
    
    const nextId = getNextCritereId();
    const newCritere = {
        id: nextId,
        nom: critere.nom.trim(),
        poids: parseFloat(critere.poids),
        created_at: new Date().toISOString(),
    };
    
    categories[categoryIndex].criteres.push(newCritere);
    saveCategories(categories);
    setNextCritereId(nextId + 1);
    
    return newCritere;
};

/**
 * Met à jour un critère dans une catégorie
 */
export const updateCritereInCategory = (categoryId, critereId, updates) => {
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
        return null;
    }
    
    const critereIndex = categories[categoryIndex].criteres.findIndex(c => c.id === critereId);
    
    if (critereIndex === -1) {
        return null;
    }
    
    if (updates.nom !== undefined) {
        categories[categoryIndex].criteres[critereIndex].nom = updates.nom.trim();
    }
    if (updates.poids !== undefined) {
        categories[categoryIndex].criteres[critereIndex].poids = parseFloat(updates.poids);
    }
    
    saveCategories(categories);
    return categories[categoryIndex].criteres[critereIndex];
};

/**
 * Supprime un critère d'une catégorie
 */
export const deleteCritereFromCategory = (categoryId, critereId) => {
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
        return false;
    }
    
    categories[categoryIndex].criteres = categories[categoryIndex].criteres.filter(
        c => c.id !== critereId
    );
    
    saveCategories(categories);
    return true;
};

/**
 * Réordonne les critères d'une catégorie
 */
export const reorderCriteresInCategory = (categoryId, critereIds) => {
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
        return null;
    }
    
    const criteres = categories[categoryIndex].criteres;
    const criteresMap = {};
    criteres.forEach(c => {
        criteresMap[c.id] = c;
    });
    
    const reordered = [];
    critereIds.forEach((id) => {
        if (criteresMap[id]) {
            reordered.push(criteresMap[id]);
        }
    });
    
    categories[categoryIndex].criteres = reordered;
    saveCategories(categories);
    
    return reordered;
};

/**
 * Calcule le poids total d'une catégorie (somme des poids de ses critères)
 */
export const getCategoryTotalWeight = (category) => {
    if (!category || !category.criteres || category.criteres.length === 0) {
        return 0;
    }
    return category.criteres.reduce((sum, critere) => sum + critere.poids, 0);
};
