/**
 * Type definitions for the application
 * These serve as documentation and can be used with JSDoc
 */

/**
 * @typedef {Object} Category
 * @property {number} id - Unique identifier
 * @property {string} nom - Category name
 * @property {string} couleur - Hex color code
 * @property {Critere[]} criteres - List of criteria
 * @property {string} created_at - ISO date string
 */

/**
 * @typedef {Object} Critere
 * @property {number} id - Unique identifier
 * @property {string} nom - Criterion name
 * @property {number} poids - Weight/importance (1-30)
 * @property {string} created_at - ISO date string
 */

/**
 * @typedef {Object} CategoryFormData
 * @property {string} nom - Category name
 * @property {string} couleur - Hex color code
 */

/**
 * @typedef {Object} CritereFormData
 * @property {string} nom - Criterion name
 * @property {number} poids - Weight/importance (1-30)
 */

/**
 * @typedef {Object} Notification
 * @property {string} message - Notification message
 * @property {'success'|'error'} type - Notification type
 */
