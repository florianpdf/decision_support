/**
 * Utility functions for generating profession template data
 */

import { CATEGORY_SUGGESTIONS } from './categorySuggestions';
import { CRITERION_SUGGESTIONS } from './criterionSuggestions';
import { COLOR_PALETTE } from '../constants/colors';
import { DEFAULT_CRITERION_TYPE } from './constants';

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate template data for a profession
 * Creates 10 random categories with 5 criteria each
 * @returns {Object} Template data with categories and criteria
 */
export const generateProfessionTemplate = () => {
  // Shuffle suggestions to get random selection
  const shuffledCategories = shuffleArray(CATEGORY_SUGGESTIONS);
  const shuffledCriteria = shuffleArray(CRITERION_SUGGESTIONS);
  
  // Select 10 random categories
  const selectedCategories = shuffledCategories.slice(0, 10);
  
  // Select colors for categories (shuffle to randomize)
  const shuffledColors = shuffleArray(COLOR_PALETTE);
  
  // Generate categories with criteria
  const categories = selectedCategories.map((categoryName, index) => {
    const category = {
      name: categoryName,
      color: shuffledColors[index % shuffledColors.length],
      criteria: []
    };
    
    // Add 5 random criteria to each category
    const categoryCriteria = shuffledCriteria.slice(index * 5, (index * 5) + 5);
    category.criteria = categoryCriteria.map(criterionName => ({
      name: criterionName,
      weight: 15, // Default importance
      type: DEFAULT_CRITERION_TYPE // NSP
    }));
    
    return category;
  });
  
  return {
    categories
  };
};
