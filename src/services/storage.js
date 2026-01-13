/**
 * Local storage management service
 * Structure: professions with their professional interests and criteria
 * Professional interests and criteria are shared across all professions
 * Criterion weights are specific to each profession
 */

// Storage keys
const PROFESSIONS_STORAGE_KEY = 'bulle_chart_professions';
const CATEGORIES_STORAGE_KEY = 'bulle_chart_categories';
const CRITERIA_STORAGE_KEY = 'bulle_chart_criteria';
const CRITERION_WEIGHTS_STORAGE_KEY = 'bulle_chart_criterion_weights';
const CHART_COLOR_MODE_STORAGE_KEY = 'bulle_chart_color_mode'; // Per profession: 'category' or 'type'
const NEXT_PROFESSION_ID_KEY = 'bulle_chart_next_profession_id';
const NEXT_CATEGORY_ID_KEY = 'bulle_chart_next_category_id';
const NEXT_CRITERION_ID_KEY = 'bulle_chart_next_criterion_id';

// ==================== PROFESSIONS ====================

/**
 * Load professions from localStorage
 */
export const loadProfessions = () => {
    try {
        const data = localStorage.getItem(PROFESSIONS_STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading professions:', error);
        return [];
    }
};

/**
 * Save professions to localStorage
 */
export const saveProfessions = (professions) => {
    try {
        localStorage.setItem(PROFESSIONS_STORAGE_KEY, JSON.stringify(professions));
        return true;
    } catch (error) {
        console.error('Error saving professions:', error);
        return false;
    }
};

/**
 * Get next available profession ID
 */
export const getNextProfessionId = () => {
    try {
        const nextId = parseInt(localStorage.getItem(NEXT_PROFESSION_ID_KEY) || '1', 10);
        return isNaN(nextId) ? 1 : nextId;
    } catch (error) {
        return 1;
    }
};

/**
 * Update next profession ID
 */
export const setNextProfessionId = (id) => {
    try {
        localStorage.setItem(NEXT_PROFESSION_ID_KEY, id.toString());
    } catch (error) {
        console.error('Error updating nextProfessionId:', error);
    }
};

/**
 * Add a new profession
 */
export const addProfession = (profession) => {
    const professions = loadProfessions();
    const nextId = getNextProfessionId();
    
    const newProfession = {
        id: nextId,
        name: profession.name.trim(),
        created_at: new Date().toISOString(),
    };
    
    professions.push(newProfession);
    saveProfessions(professions);
    setNextProfessionId(nextId + 1);
    
    return newProfession;
};

/**
 * Update a profession
 */
export const updateProfession = (id, updates) => {
    const professions = loadProfessions();
    const index = professions.findIndex(p => p.id === id);
    
    if (index === -1) {
        return null;
    }
    
    if (updates.name !== undefined) {
        professions[index].name = updates.name.trim();
    }
    
    saveProfessions(professions);
    return professions[index];
};

/**
 * Delete a profession
 */
export const deleteProfession = (id) => {
    const professions = loadProfessions();
    const filtered = professions.filter(p => p.id !== id);
    saveProfessions(filtered);
    
    // Also delete weights associated with this profession
    const weights = loadCriterionWeights();
    const filteredWeights = weights.filter(w => w.professionId !== id);
    saveCriterionWeights(filteredWeights);
    
    return true;
};

// ==================== CATEGORIES (Professional Interests) ====================

/**
 * Load categories from localStorage
 */
export const loadCategories = () => {
    try {
        const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
};

/**
 * Save categories to localStorage
 */
export const saveCategories = (categories) => {
    try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        return true;
    } catch (error) {
        console.error('Error saving categories:', error);
        return false;
    }
};

/**
 * Get next available category ID
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
 * Update next category ID
 */
export const setNextCategoryId = (id) => {
    try {
        localStorage.setItem(NEXT_CATEGORY_ID_KEY, id.toString());
    } catch (error) {
        console.error('Error updating nextCategoryId:', error);
    }
};

/**
 * Add a new category (shared across all professions)
 */
export const addCategory = (category) => {
    const categories = loadCategories();
    const nextId = getNextCategoryId();
    
    const newCategory = {
        id: nextId,
        name: category.name.trim(),
        color: category.color,
        criterionIds: [],
        created_at: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    saveCategories(categories);
    setNextCategoryId(nextId + 1);
    
    return newCategory;
};

/**
 * Update a category (affects all professions)
 */
export const updateCategory = (id, updates) => {
    const categories = loadCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
        return null;
    }
    
    if (updates.name !== undefined) {
        categories[index].name = updates.name.trim();
    }
    if (updates.color !== undefined) {
        categories[index].color = updates.color;
    }
    
    saveCategories(categories);
    return categories[index];
};

/**
 * Delete a category (deletes for all professions)
 */
export const deleteCategory = (id) => {
    const categories = loadCategories();
    const category = categories.find(c => c.id === id);
    
    if (!category) {
        return false;
    }
    
    // Delete associated criteria
    const criteria = loadCriteria();
    const criterionIds = category.criterionIds || [];
    const criteriaToDelete = criteria.filter(c => criterionIds.includes(c.id));
    criteriaToDelete.forEach(criterion => {
        deleteCriterion(criterion.id);
    });
    
    // Delete the category
    const filtered = categories.filter(c => c.id !== id);
    saveCategories(filtered);
    
    return true;
};

// ==================== CRITERIA (Key Motivations) ====================

/**
 * Load criteria from localStorage
 */
export const loadCriteria = () => {
    try {
        const data = localStorage.getItem(CRITERIA_STORAGE_KEY);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading criteria:', error);
        return [];
    }
};

/**
 * Save criteria to localStorage
 */
export const saveCriteria = (criteria) => {
    try {
        localStorage.setItem(CRITERIA_STORAGE_KEY, JSON.stringify(criteria));
        return true;
    } catch (error) {
        console.error('Error saving criteria:', error);
        return false;
    }
};

/**
 * Get next available criterion ID
 */
export const getNextCriterionId = () => {
    try {
        const nextId = parseInt(localStorage.getItem(NEXT_CRITERION_ID_KEY) || '1', 10);
        return isNaN(nextId) ? 1 : nextId;
    } catch (error) {
        return 1;
    }
};

/**
 * Update next criterion ID
 */
export const setNextCriterionId = (id) => {
    try {
        localStorage.setItem(NEXT_CRITERION_ID_KEY, id.toString());
    } catch (error) {
        console.error('Error updating nextCriterionId:', error);
    }
};

/**
 * Add a new criterion (shared across all professions)
 */
export const addCriterion = (categoryId, criterion) => {
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
        return null;
    }
    
    const criteria = loadCriteria();
    const nextId = getNextCriterionId();
    const newCriterion = {
        id: nextId,
        name: criterion.name.trim(),
        categoryId: categoryId,
        created_at: new Date().toISOString(),
    };
    
    criteria.push(newCriterion);
    saveCriteria(criteria);
    setNextCriterionId(nextId + 1);
    
    // Add criterion to category
    const cat = categories[categoryIndex];
    if (!cat.criterionIds) {
        cat.criterionIds = [];
    }
    cat.criterionIds.push(nextId);
    saveCategories(categories);
    
    return newCriterion;
};

/**
 * Update a criterion (affects all professions for name, only current profession for weight)
 */
export const updateCriterion = (criterionId, updates) => {
    const criteria = loadCriteria();
    const index = criteria.findIndex(c => c.id === criterionId);
    
    if (index === -1) {
        return null;
    }
    
    if (updates.name !== undefined) {
        criteria[index].name = updates.name.trim();
    }
    
    saveCriteria(criteria);
    return criteria[index];
};

/**
 * Delete a criterion (deletes for all professions)
 */
export const deleteCriterion = (criterionId) => {
    const criteria = loadCriteria();
    const criterion = criteria.find(c => c.id === criterionId);
    
    if (!criterion) {
        return false;
    }
    
    // Delete criterion from category
    const categories = loadCategories();
    const categoryIndex = categories.findIndex(c => c.id === criterion.categoryId);
    if (categoryIndex !== -1) {
        const cat = categories[categoryIndex];
        cat.criterionIds = (cat.criterionIds || []).filter(id => id !== criterionId);
        saveCategories(categories);
    }
    
    // Delete weights associated with this criterion
    const weights = loadCriterionWeights();
    const filteredWeights = weights.filter(w => w.criterionId !== criterionId);
    saveCriterionWeights(filteredWeights);
    
    // Delete the criterion
    const filtered = criteria.filter(c => c.id !== criterionId);
    saveCriteria(filtered);
    
    return true;
};

// ==================== CRITERION WEIGHTS (Weights specific to each profession) ====================

/**
 * Load criterion weights from localStorage
 * Structure: [{ professionId, categoryId, criterionId, weight, type }]
 */
export const loadCriterionWeights = () => {
    try {
        const data = localStorage.getItem(CRITERION_WEIGHTS_STORAGE_KEY);
        if (!data) {
            return [];
        }
        const weights = JSON.parse(data);
        // Ensure type field exists for backward compatibility
        return weights.map(w => ({
            ...w,
            type: w.type || 'neutral' // Default to neutral if not set
        }));
    } catch (error) {
        console.error('Error loading weights:', error);
        return [];
    }
};

/**
 * Save criterion weights to localStorage
 */
export const saveCriterionWeights = (weights) => {
    try {
        localStorage.setItem(CRITERION_WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
        return true;
    } catch (error) {
        console.error('Error saving weights:', error);
        return false;
    }
};

/**
 * Get weight of a criterion for a given profession
 */
export const getCriterionWeight = (professionId, criterionId) => {
    const weights = loadCriterionWeights();
    const weight = weights.find(w => w.professionId === professionId && w.criterionId === criterionId);
    return weight ? weight.weight : 15; // Default: 15
};

/**
 * Get type of a criterion for a given profession
 */
export const getCriterionType = (professionId, criterionId) => {
    const weights = loadCriterionWeights();
    const weight = weights.find(w => w.professionId === professionId && w.criterionId === criterionId);
    return weight ? (weight.type || 'neutral') : 'neutral'; // Default: neutral
};

/**
 * Update weight of a criterion for a given profession
 */
export const setCriterionWeight = (professionId, categoryId, criterionId, weight) => {
    const weights = loadCriterionWeights();
    const index = weights.findIndex(
        w => w.professionId === professionId && w.criterionId === criterionId
    );
    
    const existing = index !== -1 ? weights[index] : null;
    const weightData = {
        professionId,
        categoryId,
        criterionId,
        weight: parseFloat(weight),
        type: existing?.type || 'neutral', // Preserve existing type or default
    };
    
    if (index === -1) {
        weights.push(weightData);
    } else {
        weights[index] = weightData;
    }
    
    saveCriterionWeights(weights);
    return weightData;
};

/**
 * Update type of a criterion for a given profession
 */
export const setCriterionType = (professionId, categoryId, criterionId, type) => {
    const weights = loadCriterionWeights();
    const index = weights.findIndex(
        w => w.professionId === professionId && w.criterionId === criterionId
    );
    
    const existing = index !== -1 ? weights[index] : null;
    const weightData = {
        professionId,
        categoryId,
        criterionId,
        weight: existing?.weight || 15, // Preserve existing weight or default
        type: type,
    };
    
    if (index === -1) {
        weights.push(weightData);
    } else {
        weights[index] = weightData;
    }
    
    saveCriterionWeights(weights);
    return weightData;
};

/**
 * Initialize weights for a new profession (copy from last created profession)
 */
export const initializeProfessionWeights = (newProfessionId, sourceProfessionId) => {
    const sourceWeights = loadCriterionWeights().filter(w => w.professionId === sourceProfessionId);
    const weights = loadCriterionWeights();
    
    sourceWeights.forEach(weight => {
        weights.push({
            professionId: newProfessionId,
            categoryId: weight.categoryId,
            criterionId: weight.criterionId,
            weight: weight.weight,
            type: weight.type || 'neutral', // Preserve type or default
        });
    });
    
    saveCriterionWeights(weights);
    return weights.filter(w => w.professionId === newProfessionId);
};

/**
 * Get all categories with their criteria and weights for a given profession
 */
export const getCategoriesForProfession = (professionId) => {
    if (!professionId) {
        return [];
    }
    
    const categories = loadCategories();
    const criteria = loadCriteria();
    const weights = loadCriterionWeights();
    
    return categories.map(category => {
        const criterionIds = category.criterionIds || [];
        const categoryCriteria = criterionIds
            .map(criterionId => {
                const criterion = criteria.find(c => c.id === criterionId);
                if (!criterion) return null;
                
                const weight = weights.find(
                    w => w.professionId === professionId && w.criterionId === criterionId
                );
                
                return {
                    ...criterion,
                    weight: weight ? weight.weight : 15, // Default: 15
                    type: weight ? (weight.type || 'neutral') : 'neutral', // Default: neutral
                };
            })
            .filter(c => c !== null);
        
        return {
            ...category,
            criteria: categoryCriteria,
        };
    });
};

/**
 * Calculate total weight of a category for a given profession
 */
export const getCategoryTotalWeight = (category, professionId) => {
    if (!category || !category.criteria || category.criteria.length === 0) {
        return 0;
    }
    return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 15), 0);
};

// ==================== CHART COLOR MODE (Per profession preference) ====================

/**
 * Get chart color mode for a profession
 * @param {number} professionId - Profession ID
 * @returns {string} 'category' or 'type' (default: 'category')
 */
export const getChartColorMode = (professionId) => {
    try {
        const data = localStorage.getItem(CHART_COLOR_MODE_STORAGE_KEY);
        if (!data) {
            return 'category'; // Default
        }
        const modes = JSON.parse(data);
        return modes[professionId] || 'category';
    } catch (error) {
        console.error('Error loading chart color mode:', error);
        return 'category';
    }
};

/**
 * Set chart color mode for a profession
 * @param {number} professionId - Profession ID
 * @param {string} mode - 'category' or 'type'
 */
export const setChartColorMode = (professionId, mode) => {
    try {
        const data = localStorage.getItem(CHART_COLOR_MODE_STORAGE_KEY);
        const modes = data ? JSON.parse(data) : {};
        modes[professionId] = mode;
        localStorage.setItem(CHART_COLOR_MODE_STORAGE_KEY, JSON.stringify(modes));
        return true;
    } catch (error) {
        console.error('Error saving chart color mode:', error);
        return false;
    }
};
