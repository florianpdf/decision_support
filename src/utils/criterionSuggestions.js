/**
 * List of suggested key motivations (criteria)
 * These are common motivations that users might want to use
 */
export const CRITERION_SUGGESTIONS = [
  'Autonomie',
  'Équilibre vie pro/perso',
  'Salaire attractif',
  'Évolution de carrière',
  'Formation continue',
  'Reconnaissance',
  'Défis techniques',
  'Travail en équipe',
  'Innovation',
  'Créativité',
  'Impact social',
  'Stabilité',
  'Diversité des missions',
  'Management',
  'Leadership',
  'Relations clients',
  'Voyage professionnel',
  'Télétravail',
  'Horaires flexibles',
  'Proximité géographique',
  'Ambiance de travail',
  'Responsabilités',
  'Projets variés',
  'Technologies récentes',
  'Secteur d\'activité',
  'Taille d\'entreprise',
  'Culture d\'entreprise',
  'Bien-être au travail',
  'Avantages sociaux',
  'Perspectives d\'avenir'
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
 * Filter suggestions based on search term (case-insensitive, accent-insensitive)
 * @param {string} searchTerm - Search term
 * @param {Array} suggestions - Array of suggestions
 * @returns {Array} Filtered suggestions
 */
export const filterCriterionSuggestions = (searchTerm, suggestions) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return suggestions;
  }
  
  const normalizedSearch = normalizeString(searchTerm);
  
  return suggestions.filter(suggestion => {
    return normalizeString(suggestion).includes(normalizedSearch);
  });
};
