/**
 * Utilities for calculating comparison metrics between professions
 */

import { getCategoriesForProfession, getCategoriesForProfessions } from '../services/storage';
import { CRITERION_TYPES, WEIGHT_RANGES } from './constants';

/**
 * Calculate the distribution of criterion types for a category
 * @param {Array} criteria - Array of criteria with weight and type
 * @returns {Object} Distribution object with type totals
 */
const calculateTypeDistribution = (criteria) => {
  const distribution = {
    advantage: 0,
    small_advantage: 0,
    neutral: 0,
    small_disadvantage: 0,
    disadvantage: 0,
    total: 0
  };

  criteria.forEach(criterion => {
    const weight = criterion.weight || 15;
    distribution.total += weight;
    
    switch (criterion.type) {
      case CRITERION_TYPES.ADVANTAGE:
        distribution.advantage += weight;
        break;
      case CRITERION_TYPES.SMALL_ADVANTAGE:
        distribution.small_advantage += weight;
        break;
      case CRITERION_TYPES.NEUTRAL:
        distribution.neutral += weight;
        break;
      case CRITERION_TYPES.SMALL_DISADVANTAGE:
        distribution.small_disadvantage += weight;
        break;
      case CRITERION_TYPES.DISADVANTAGE:
        distribution.disadvantage += weight;
        break;
      default:
        distribution.neutral += weight;
    }
  });

  return distribution;
};

/**
 * Calculate all metrics for a single profession
 * @param {number} professionId - Profession ID
 * @returns {Object} Metrics object
 */
export const calculateProfessionMetrics = (professionId) => {
  if (!professionId) {
    return null;
  }

  const categories = getCategoriesForProfession(professionId);
  
  // Filter out categories without criteria
  const categoriesWithCriteria = categories.filter(cat => 
    cat.criteria && cat.criteria.length > 0
  );

  // Calculate totals
  let totalWeight = 0;
  let totalCriteriaCount = 0;
  const typeDistribution = {
    advantage: 0,
    small_advantage: 0,
    neutral: 0,
    small_disadvantage: 0,
    disadvantage: 0
  };

  // Category details
  const categoryDetails = categoriesWithCriteria.map(category => {
    const categoryWeight = category.criteria.reduce(
      (sum, criterion) => sum + (criterion.weight || 15), 
      0
    );
    const categoryTypeDist = calculateTypeDistribution(category.criteria);
    
    totalWeight += categoryWeight;
    totalCriteriaCount += category.criteria.length;
    
    // Add to global type distribution
    Object.keys(typeDistribution).forEach(type => {
      typeDistribution[type] += categoryTypeDist[type] || 0;
    });

    return {
      id: category.id,
      name: category.name,
      color: category.color,
      weight: categoryWeight,
      criteriaCount: category.criteria.length,
      typeDistribution: categoryTypeDist
    };
  });

  // Calculate global score (simple sum of all weights)
  const globalScore = totalWeight;

  // Get top 3 categories by weight
  const topCategories = [...categoryDetails]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(cat => ({
      name: cat.name,
      weight: cat.weight,
      color: cat.color
    }));

  // Get top 3 criteria by weight
  const allCriteria = categoriesWithCriteria.flatMap(cat => 
    cat.criteria.map(criterion => ({
      ...criterion,
      categoryName: cat.name,
      categoryColor: cat.color
    }))
  );
  
  const topCriteria = [...allCriteria]
    .sort((a, b) => (b.weight || 15) - (a.weight || 15))
    .slice(0, 3)
    .map(criterion => ({
      name: criterion.name,
      weight: criterion.weight || 15,
      type: criterion.type || 'neutral',
      categoryName: criterion.categoryName
    }));

  return {
    professionId,
    globalScore,
    totalWeight,
    totalCriteriaCount,
    typeDistribution,
    categoryDetails,
    topCategories,
    topCriteria,
    categoriesCount: categoriesWithCriteria.length
  };
};

/**
 * Calculate metrics for multiple professions (optimized)
 * @param {number[]} professionIds - Array of profession IDs
 * @returns {Object} Object with professionId as key and metrics as value
 */
export const calculateProfessionsMetrics = (professionIds) => {
  if (!professionIds || professionIds.length === 0) {
    return {};
  }

  // Use optimized function to load all data at once
  const categoriesByProfession = getCategoriesForProfessions(professionIds);
  
  const result = {};

  professionIds.forEach(professionId => {
    const categories = categoriesByProfession[professionId] || [];
    
    // Filter out categories without criteria
    const categoriesWithCriteria = categories.filter(cat => 
      cat.criteria && cat.criteria.length > 0
    );

    // Calculate totals
    let totalWeight = 0;
    let totalCriteriaCount = 0;
    const typeDistribution = {
      advantage: 0,
      small_advantage: 0,
      neutral: 0,
      small_disadvantage: 0,
      disadvantage: 0
    };

    // Category details
    const categoryDetails = categoriesWithCriteria.map(category => {
      const categoryWeight = category.criteria.reduce(
        (sum, criterion) => sum + (criterion.weight || 15), 
        0
      );
      const categoryTypeDist = calculateTypeDistribution(category.criteria);
      
      totalWeight += categoryWeight;
      totalCriteriaCount += category.criteria.length;
      
      // Add to global type distribution
      Object.keys(typeDistribution).forEach(type => {
        typeDistribution[type] += categoryTypeDist[type] || 0;
      });

      return {
        id: category.id,
        name: category.name,
        color: category.color,
        weight: categoryWeight,
        criteriaCount: category.criteria.length,
        typeDistribution: categoryTypeDist
      };
    });

    // Calculate global score
    const globalScore = totalWeight;

    // Get top 3 categories by weight
    const topCategories = [...categoryDetails]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(cat => ({
        name: cat.name,
        weight: cat.weight,
        color: cat.color
      }));

    // Get top 3 criteria by weight
    const allCriteria = categoriesWithCriteria.flatMap(cat => 
      cat.criteria.map(criterion => ({
        ...criterion,
        categoryName: cat.name,
        categoryColor: cat.color
      }))
    );
    
    const topCriteria = [...allCriteria]
      .sort((a, b) => (b.weight || 15) - (a.weight || 15))
      .slice(0, 3)
      .map(criterion => ({
        name: criterion.name,
        weight: criterion.weight || 15,
        type: criterion.type || 'neutral',
        categoryName: criterion.categoryName
      }));

    result[professionId] = {
      professionId,
      globalScore,
      totalWeight,
      totalCriteriaCount,
      typeDistribution,
      categoryDetails,
      topCategories,
      topCriteria,
      categoriesCount: categoriesWithCriteria.length
    };
  });

  return result;
};
