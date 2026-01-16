/**
 * Service for calculating profession recommendations based on criteria
 */

import { getCategoriesForProfessions } from './storage';
import { CRITERION_TYPES } from '../utils/constants';

/**
 * Default recommendation preferences
 */
export const DEFAULT_PREFERENCES = {
  advantageWeight: 0.6, // 60% weight for advantages
  disadvantageWeight: 0.4, // 40% weight for disadvantages
  priorityCategories: {} // { categoryId: priority (1-5) }
};

/**
 * Calculate the type multiplier for a category based on its criterion types
 * @param {Object} typeDistribution - Distribution of types in the category
 * @param {number} totalWeight - Total weight of the category
 * @returns {number} Multiplier (1.5 for advantages, 0.5 for disadvantages, 1.0 for neutral/balanced)
 */
const calculateTypeMultiplier = (typeDistribution, totalWeight) => {
  if (totalWeight === 0) return 1.0;

  // Calculate percentages
  const advantageTotal = (typeDistribution.advantage || 0) + (typeDistribution.small_advantage || 0);
  const disadvantageTotal = (typeDistribution.small_disadvantage || 0) + (typeDistribution.disadvantage || 0);
  const neutralTotal = typeDistribution.neutral || 0;

  const advantagePercent = (advantageTotal / totalWeight) * 100;
  const disadvantagePercent = (disadvantageTotal / totalWeight) * 100;
  const neutralPercent = (neutralTotal / totalWeight) * 100;

  // Determine majority (threshold: 50%)
  if (advantagePercent >= 50) {
    return 1.5; // Majority advantages
  } else if (disadvantagePercent >= 50) {
    return 0.5; // Majority disadvantages
  } else if (neutralPercent >= 50) {
    return 1.0; // Majority NSP (neutral)
  } else {
    return 1.0; // Balanced (no majority)
  }
};

/**
 * Calculate the score for a single category
 * @param {Object} category - Category with criteria
 * @param {number} professionId - Profession ID
 * @param {Object} preferences - Recommendation preferences
 * @returns {number} Category score
 */
const calculateCategoryScore = (category, professionId, preferences) => {
  // Ignore categories without criteria
  if (!category.criteria || category.criteria.length === 0) {
    return 0;
  }

  // Calculate total weight of the category
  const totalWeight = category.criteria.reduce(
    (sum, criterion) => sum + (criterion.weight || 15),
    0
  );

  // Calculate type distribution
  const typeDistribution = {
    advantage: 0,
    small_advantage: 0,
    neutral: 0,
    small_disadvantage: 0,
    disadvantage: 0
  };

  category.criteria.forEach(criterion => {
    const weight = criterion.weight || 15;
    const type = criterion.type || 'neutral';
    
    switch (type) {
      case CRITERION_TYPES.ADVANTAGE:
        typeDistribution.advantage += weight;
        break;
      case CRITERION_TYPES.SMALL_ADVANTAGE:
        typeDistribution.small_advantage += weight;
        break;
      case CRITERION_TYPES.NEUTRAL:
        typeDistribution.neutral += weight;
        break;
      case CRITERION_TYPES.SMALL_DISADVANTAGE:
        typeDistribution.small_disadvantage += weight;
        break;
      case CRITERION_TYPES.DISADVANTAGE:
        typeDistribution.disadvantage += weight;
        break;
    }
  });

  // Calculate type multiplier
  const typeMultiplier = calculateTypeMultiplier(typeDistribution, totalWeight);

  // Apply category priority if set
  const categoryPriority = preferences.priorityCategories[category.id] || 3; // Default: 3 (normal)
  const priorityMultiplier = categoryPriority === 5 ? 2.0 :
                              categoryPriority === 4 ? 1.5 :
                              categoryPriority === 3 ? 1.0 :
                              categoryPriority === 2 ? 0.5 : 0.2;

  // Calculate base score
  const baseScore = totalWeight * typeMultiplier;

  // Apply priority
  return baseScore * priorityMultiplier;
};

/**
 * Calculate the total score for a profession
 * @param {number} professionId - Profession ID
 * @param {Object} preferences - Recommendation preferences
 * @param {Object} categoriesByProfession - Pre-loaded categories by profession (from getCategoriesForProfessions)
 * @returns {Object} Score details
 */
export const calculateProfessionScore = (professionId, preferences, categoriesByProfession) => {
  const categories = categoriesByProfession[professionId] || [];
  
  let totalScore = 0;
  const categoryScores = [];

  categories.forEach(category => {
    const categoryScore = calculateCategoryScore(category, professionId, preferences);
    if (categoryScore !== 0) {
      totalScore += categoryScore;
      categoryScores.push({
        categoryId: category.id,
        categoryName: category.name,
        score: categoryScore
      });
    }
  });

  return {
    professionId,
    totalScore,
    categoryScores
  };
};

/**
 * Calculate confidence score based on score differences
 * @param {Array} scores - Array of { professionId, totalScore }
 * @returns {Object} Confidence object with percentage and label
 */
export const calculateConfidenceScore = (scores) => {
  if (scores.length < 2) {
    return {
      percentage: 100,
      label: 'Très fiable'
    };
  }

  // Sort by score descending
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);
  const maxScore = sortedScores[0].totalScore;
  const secondScore = sortedScores[1].totalScore;

  if (maxScore === 0) {
    return {
      percentage: 0,
      label: 'Non fiable'
    };
  }

  // Calculate percentage difference
  const difference = maxScore - secondScore;
  const percentage = (difference / maxScore) * 100;

  // Determine label
  let label;
  if (percentage >= 80) {
    label = 'Très fiable';
  } else if (percentage >= 60) {
    label = 'Fiable';
  } else if (percentage >= 40) {
    label = 'Moyennement fiable';
  } else {
    label = 'Peu fiable';
  }

  return {
    percentage: Math.round(percentage),
    label
  };
};

/**
 * Get recommendation for professions based on preferences
 * @param {number[]} professionIds - Array of profession IDs to compare
 * @param {Object} preferences - Recommendation preferences (optional, uses defaults if not provided)
 * @returns {Object} Recommendation result
 */
export const getRecommendation = (professionIds, preferences = {}) => {
  if (!professionIds || professionIds.length === 0) {
    return null;
  }

  // Merge with default preferences
  const finalPreferences = {
    ...DEFAULT_PREFERENCES,
    ...preferences
  };

  // Load all categories at once (optimized)
  const categoriesByProfession = getCategoriesForProfessions(professionIds);

  // Calculate scores for all professions
  const scores = professionIds.map(professionId => {
    return calculateProfessionScore(professionId, finalPreferences, categoriesByProfession);
  });

  // Sort by score descending
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

  // Get recommended profession (highest score)
  const recommended = sortedScores[0];

  // Calculate confidence
  const confidence = calculateConfidenceScore(scores);

  // Build explanation
  const explanation = {
    points: [],
    warnings: []
  };

  // Find top contributing categories
  const topCategories = recommended.categoryScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (topCategories.length > 0) {
    explanation.points.push(
      `Points forts : ${topCategories.map(c => c.categoryName).join(', ')}`
    );
  }

  // Compare with second place
  if (sortedScores.length > 1 && sortedScores[1].totalScore > 0) {
    const secondPlace = sortedScores[1];
    const difference = recommended.totalScore - secondPlace.totalScore;
    const percentDiff = ((difference / recommended.totalScore) * 100).toFixed(1);
    
    explanation.points.push(
      `Score supérieur de ${percentDiff}% par rapport au second métier`
    );
  }

  // Add warnings if confidence is low
  if (confidence.percentage < 40) {
    explanation.warnings.push(
      'Les scores sont très proches. La recommandation est peu fiable.'
    );
  }

  return {
    recommendedProfessionId: recommended.professionId,
    recommendedScore: recommended.totalScore,
    confidence,
    allScores: sortedScores,
    explanation,
    preferences: finalPreferences
  };
};
