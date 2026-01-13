/**
 * Type definitions for the application
 * These serve as documentation and can be used with JSDoc
 */

/**
 * @typedef {Object} Profession
 * @property {number} id - Unique identifier
 * @property {string} name - Profession name
 * @property {string} created_at - ISO date string
 */

/**
 * @typedef {Object} Category
 * @property {number} id - Unique identifier
 * @property {string} name - Category name
 * @property {string} color - Hex color code
 * @property {Criterion[]} criteria - List of criteria
 * @property {string} created_at - ISO date string
 */

/**
 * @typedef {Object} Criterion
 * @property {number} id - Unique identifier
 * @property {string} name - Criterion name
 * @property {string} created_at - ISO date string
 */

/**
 * @typedef {Object} CriterionWeight
 * @property {number} professionId - Profession identifier
 * @property {number} weight - Weight/importance (1-30)
 */

/**
 * @typedef {Object} CategoryFormData
 * @property {string} name - Category name
 * @property {string} color - Hex color code
 */

/**
 * @typedef {Object} CriterionFormData
 * @property {string} name - Criterion name
 * @property {number} weight - Weight/importance (1-30)
 */

/**
 * @typedef {Object} Notification
 * @property {string} message - Notification message
 * @property {'success'|'error'} type - Notification type
 */
