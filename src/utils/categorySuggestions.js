/**
 * List of suggested professional interests
 * These are common professional interests that users might want to use
 */
export const CATEGORY_SUGGESTIONS = [
  'Management',
  'Innovation',
  'Relationnel',
  'Technique',
  'Créativité',
  'Autonomie',
  'Stabilité',
  'Équipe',
  'Formation',
  'Développement',
  'Communication',
  'Organisation',
  'Stratégie',
  'Analyse',
  'Résolution de problèmes',
  'Leadership',
  'Négociation',
  'Planification',
  'Recherche',
  'Conception',
  'Réalisation',
  'Contrôle qualité',
  'Gestion de projet',
  'Veille technologique',
  'Mentorat',
  'Commercial',
  'Marketing',
  'Finance',
  'Ressources humaines',
  'International'
];

/**
 * Normalize string for comparison (remove accents, convert to lowercase)
 * @param {string} str - String to normalize
 * @returns {string} Normalized string
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
};

/**
 * Check if a category name is already used (case-insensitive, accent-insensitive)
 * @param {string} name - Category name to check
 * @param {Array} existingCategories - Array of existing categories
 * @returns {boolean} True if name is already used
 */
export const isCategoryNameUsed = (name, existingCategories) => {
  if (!name || !existingCategories || existingCategories.length === 0) {
    return false;
  }
  
  const normalizedName = normalizeString(name);
  return existingCategories.some(cat => 
    normalizeString(cat.name) === normalizedName
  );
};

/**
 * Filter suggestions based on search term (case-insensitive, accent-insensitive)
 * @param {string} searchTerm - Search term
 * @param {Array} suggestions - Array of suggestions
 * @param {Array} existingCategories - Array of existing categories to exclude
 * @returns {Array} Filtered suggestions
 */
export const filterSuggestions = (searchTerm, suggestions, existingCategories = []) => {
  if (!searchTerm || searchTerm.trim() === '') {
    // Return all unused suggestions
    return suggestions.filter(suggestion => 
      !isCategoryNameUsed(suggestion, existingCategories)
    );
  }
  
  const normalizedSearch = normalizeString(searchTerm);
  const existingNames = existingCategories.map(cat => normalizeString(cat.name));
  
  return suggestions.filter(suggestion => {
    // Check if already used
    if (existingNames.includes(normalizeString(suggestion))) {
      return false;
    }
    // Check if matches search term
    return normalizeString(suggestion).includes(normalizedSearch);
  });
};
