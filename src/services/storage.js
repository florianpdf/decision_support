/**
 * Local storage management service
 * Structure: professions with their professional interests and criteria
 * Professional interests and criteria are shared across all professions
 * Criterion weights are specific to each profession
 */

// Storage keys (keeping old keys for migration compatibility)
const PROFESSIONS_STORAGE_KEY = 'bulle_chart_professions';
const METIERS_STORAGE_KEY = 'bulle_chart_metiers'; // Legacy key for migration
const CATEGORIES_STORAGE_KEY = 'bulle_chart_categories';
const CRITERIA_STORAGE_KEY = 'bulle_chart_criteria';
const CRITERES_STORAGE_KEY = 'bulle_chart_criteres'; // Legacy key for migration
const CRITERION_WEIGHTS_STORAGE_KEY = 'bulle_chart_criterion_weights';
const CRITERE_WEIGHTS_STORAGE_KEY = 'bulle_chart_critere_weights'; // Legacy key
const NEXT_PROFESSION_ID_KEY = 'bulle_chart_next_profession_id';
const NEXT_METIER_ID_KEY = 'bulle_chart_next_metier_id'; // Legacy key
const NEXT_CATEGORY_ID_KEY = 'bulle_chart_next_category_id';
const NEXT_CRITERION_ID_KEY = 'bulle_chart_next_criterion_id';
const NEXT_CRITERE_ID_KEY = 'bulle_chart_next_critere_id'; // Legacy key

// ==================== PROFESSIONS ====================

/**
 * Load professions from localStorage
 */
export const loadProfessions = () => {
    try {
        // Try new key first
        let data = localStorage.getItem(PROFESSIONS_STORAGE_KEY);
        if (!data) {
            // Try legacy key for migration
            data = localStorage.getItem(METIERS_STORAGE_KEY);
            if (data) {
                const metiers = JSON.parse(data);
                // Migrate to new structure
                const professions = metiers.map(m => ({
                    id: m.id,
                    name: m.nom || m.name,
                    created_at: m.created_at
                }));
                saveProfessions(professions);
                localStorage.removeItem(METIERS_STORAGE_KEY);
                return professions;
            }
        }
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
        let nextId = parseInt(localStorage.getItem(NEXT_PROFESSION_ID_KEY) || '0', 10);
        if (nextId === 0) {
            // Try legacy key
            nextId = parseInt(localStorage.getItem(NEXT_METIER_ID_KEY) || '1', 10);
            if (nextId > 0) {
                setNextProfessionId(nextId);
                localStorage.removeItem(NEXT_METIER_ID_KEY);
            }
        }
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

// Legacy functions for backward compatibility during migration
export const loadMetiers = loadProfessions;
export const saveMetiers = saveProfessions;
export const getNextMetierId = getNextProfessionId;
export const setNextMetierId = setNextProfessionId;
export const addMetier = (metier) => addProfession({ name: metier.nom || metier.name });
export const updateMetier = (id, updates) => updateProfession(id, { name: updates.nom || updates.name });
export const deleteMetier = deleteProfession;

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
        const categories = JSON.parse(data);
        // Migrate old structure if needed
        return categories.map(cat => {
            if (cat.nom && !cat.name) {
                return { ...cat, name: cat.nom, color: cat.couleur || cat.color };
            }
            return cat;
        });
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
        name: (category.name || category.nom || '').trim(),
        color: category.color || category.couleur,
        criterionIds: [], // List of associated criterion IDs
        created_at: new Date().toISOString(),
    };
    
    // Ensure criterionIds is always an array
    if (!newCategory.criterionIds) {
        newCategory.criterionIds = [];
    }
    
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
    
    if (updates.name !== undefined || updates.nom !== undefined) {
        categories[index].name = (updates.name || updates.nom || '').trim();
    }
    if (updates.color !== undefined || updates.couleur !== undefined) {
        categories[index].color = updates.color || updates.couleur;
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
    const criterionIds = category.criterionIds || category.critereIds || [];
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
        // Try new key first
        let data = localStorage.getItem(CRITERIA_STORAGE_KEY);
        if (!data) {
            // Try legacy key for migration
            data = localStorage.getItem(CRITERES_STORAGE_KEY);
            if (data) {
                const criteres = JSON.parse(data);
                // Migrate to new structure
                const criteria = criteres.map(c => ({
                    id: c.id,
                    name: c.nom || c.name,
                    categoryId: c.categoryId,
                    created_at: c.created_at
                }));
                saveCriteria(criteria);
                localStorage.removeItem(CRITERES_STORAGE_KEY);
                return criteria;
            }
        }
        if (!data) {
            return [];
        }
        const criteria = JSON.parse(data);
        // Migrate old structure if needed
        return criteria.map(c => {
            if (c.nom && !c.name) {
                return { ...c, name: c.nom };
            }
            return c;
        });
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
        let nextId = parseInt(localStorage.getItem(NEXT_CRITERION_ID_KEY) || '0', 10);
        if (nextId === 0) {
            // Try legacy key
            nextId = parseInt(localStorage.getItem(NEXT_CRITERE_ID_KEY) || '1', 10);
            if (nextId > 0) {
                setNextCriterionId(nextId);
                localStorage.removeItem(NEXT_CRITERE_ID_KEY);
            }
        }
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
        name: (criterion.name || criterion.nom || '').trim(),
        categoryId: categoryId,
        created_at: new Date().toISOString(),
    };
    
    criteria.push(newCriterion);
    saveCriteria(criteria);
    setNextCriterionId(nextId + 1);
    
    // Add criterion to category
    const cat = categories[categoryIndex];
    if (!cat.criterionIds) {
        cat.criterionIds = cat.critereIds || [];
    }
    cat.criterionIds.push(nextId);
    // Remove legacy key if exists
    if (cat.critereIds) {
        delete cat.critereIds;
    }
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
    
    if (updates.name !== undefined || updates.nom !== undefined) {
        criteria[index].name = (updates.name || updates.nom || '').trim();
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
        const criterionIds = cat.criterionIds || cat.critereIds || [];
        cat.criterionIds = criterionIds.filter(id => id !== criterionId);
        if (cat.critereIds) {
            delete cat.critereIds;
        }
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

// Legacy functions for backward compatibility
export const loadCriteres = loadCriteria;
export const saveCriteres = saveCriteria;
export const getNextCritereId = getNextCriterionId;
export const setNextCritereId = setNextCriterionId;
export const addCritere = (categoryId, critere) => addCriterion(categoryId, { name: critere.nom || critere.name });
export const updateCritere = (id, updates) => updateCriterion(id, { name: updates.nom || updates.name });
export const deleteCritere = deleteCriterion;

// ==================== CRITERION WEIGHTS (Weights specific to each profession) ====================

/**
 * Load criterion weights from localStorage
 * Structure: [{ professionId, categoryId, criterionId, weight }]
 */
export const loadCriterionWeights = () => {
    try {
        // Try new key first
        let data = localStorage.getItem(CRITERION_WEIGHTS_STORAGE_KEY);
        if (!data) {
            // Try legacy key for migration
            data = localStorage.getItem(CRITERE_WEIGHTS_STORAGE_KEY);
            if (data) {
                const oldWeights = JSON.parse(data);
                // Migrate to new structure
                const weights = oldWeights.map(w => ({
                    professionId: w.metierId || w.professionId,
                    categoryId: w.categoryId,
                    criterionId: w.critereId || w.criterionId,
                    weight: w.poids || w.weight
                }));
                saveCriterionWeights(weights);
                localStorage.removeItem(CRITERE_WEIGHTS_STORAGE_KEY);
                return weights;
            }
        }
        if (!data) {
            return [];
        }
        const weights = JSON.parse(data);
        // Migrate old structure if needed
        return weights.map(w => {
            if (w.metierId || w.poids) {
                return {
                    professionId: w.metierId || w.professionId,
                    categoryId: w.categoryId,
                    criterionId: w.critereId || w.criterionId,
                    weight: w.poids || w.weight
                };
            }
            return w;
        });
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
 * Update weight of a criterion for a given profession
 */
export const setCriterionWeight = (professionId, categoryId, criterionId, weight) => {
    const weights = loadCriterionWeights();
    const index = weights.findIndex(
        w => w.professionId === professionId && w.criterionId === criterionId
    );
    
    const weightData = {
        professionId,
        categoryId,
        criterionId,
        weight: parseFloat(weight),
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
        });
    });
    
    saveCriterionWeights(weights);
    return weights.filter(w => w.professionId === newProfessionId);
};

// Legacy functions
export const loadCritereWeights = loadCriterionWeights;
export const saveCritereWeights = saveCriterionWeights;
export const getCritereWeight = (metierId, critereId) => getCriterionWeight(metierId, critereId);
export const setCritereWeight = (metierId, categoryId, critereId, poids) => setCriterionWeight(metierId, categoryId, critereId, poids);
export const initializeMetierWeights = initializeProfessionWeights;

/**
 * Migrate old data structure to new structure
 */
const migrateOldData = () => {
    const categories = loadCategories();
    let needsMigration = false;
    
    const migratedCategories = categories.map(category => {
        // If category has old structure (criteres array), migrate it
        const oldCriteres = category.criteres;
        const oldCritereIds = category.critereIds;
        const criterionIds = category.criterionIds || oldCritereIds || [];
        
        if (oldCriteres && Array.isArray(oldCriteres) && oldCriteres.length > 0 && criterionIds.length === 0) {
            needsMigration = true;
            
            // Migrate criteria to separate storage
            const criteria = loadCriteria();
            const weights = loadCriterionWeights();
            const professions = loadProfessions();
            
            oldCriteres.forEach(oldCritere => {
                // Check if criterion already exists
                const existingCriterion = criteria.find(c => c.id === oldCritere.id);
                if (!existingCriterion) {
                    criteria.push({
                        id: oldCritere.id,
                        name: oldCritere.nom || oldCritere.name,
                        categoryId: category.id,
                        created_at: oldCritere.created_at || new Date().toISOString(),
                    });
                }
                
                // Migrate weights for all professions
                professions.forEach(profession => {
                    const existingWeight = weights.find(
                        w => w.professionId === profession.id && w.criterionId === oldCritere.id
                    );
                    if (!existingWeight) {
                        weights.push({
                            professionId: profession.id,
                            categoryId: category.id,
                            criterionId: oldCritere.id,
                            weight: oldCritere.poids || oldCritere.weight || 15,
                        });
                    }
                });
            });
            
            saveCriteria(criteria);
            saveCriterionWeights(weights);
            
            // Return migrated category
            const migrated = {
                ...category,
                criterionIds: oldCriteres.map(c => c.id).filter(id => id),
            };
            delete migrated.criteres;
            delete migrated.critereIds;
            return migrated;
        }
        
        // Ensure criterionIds exists and migrate critereIds if needed
        if (oldCritereIds && !category.criterionIds) {
            needsMigration = true;
            return {
                ...category,
                criterionIds: oldCritereIds,
            };
        }
        
        if (!category.criterionIds) {
            needsMigration = true;
            return {
                ...category,
                criterionIds: []
            };
        }
        
        // Clean up legacy keys
        const cleaned = { ...category };
        if (cleaned.critereIds) delete cleaned.critereIds;
        if (cleaned.criteres) delete cleaned.criteres;
        if (cleaned.nom) {
            cleaned.name = cleaned.nom;
            delete cleaned.nom;
        }
        if (cleaned.couleur) {
            cleaned.color = cleaned.couleur;
            delete cleaned.couleur;
        }
        if (needsMigration || cleaned.nom || cleaned.couleur || cleaned.critereIds || cleaned.criteres) {
            needsMigration = true;
        }
        
        return cleaned;
    });
    
    if (needsMigration) {
        saveCategories(migratedCategories);
    }
    
    return migratedCategories;
};

/**
 * Get all categories with their criteria and weights for a given profession
 */
export const getCategoriesForProfession = (professionId) => {
    if (!professionId) {
        return [];
    }
    
    // Migrate old data if needed
    const categories = migrateOldData();
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
                };
            })
            .filter(c => c !== null);
        
        return {
            ...category,
            criteria: categoryCriteria,
        };
    });
};

// Legacy function
export const getCategoriesForMetier = getCategoriesForProfession;

/**
 * Calculate total weight of a category for a given profession
 */
export const getCategoryTotalWeight = (category, professionId) => {
    if (!category || !category.criteria || category.criteria.length === 0) {
        return 0;
    }
    return category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 15), 0);
};
