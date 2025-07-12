const { body } = require('express-validator');

// Your Custom Guide Validation Rules
const validateGuideCreation = [
  // Required basic fields
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required'),

  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)'),
    // No age restriction - any age is allowed

  body('nic')
    .notEmpty()
    .withMessage('NIC is required')
    .trim(),

  body('contact')
    .notEmpty()
    .withMessage('Contact number is required')
    .trim(),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),

  // One or more languages must be filled (no rules on which languages)
  body('languages')
    .notEmpty()
    .withMessage('At least one language is required')
    .isArray({ min: 1 })
    .withMessage('You must select at least one language'),

  // One or more availability must be filled (no rules on which)
  body('availability')
    .notEmpty()
    .withMessage('At least one availability option is required')
    .isArray({ min: 1 })
    .withMessage('You must select at least one availability option'),

  // One or more covered locations must be filled (no rules on which)
  body('coveredLocations')
    .notEmpty()
    .withMessage('At least one covered location is required')
    .isArray({ min: 1 })
    .withMessage('You must select at least one covered location'),

  // Professional experience - completely optional, any content allowed
  body('experiences')
    .optional()
    .trim(),

  // About You section - MUST have something
  body('description')
    .notEmpty()
    .withMessage('You must write something about yourself in the About You section')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please tell us something about yourself')
];

// Update validation (same rules but optional for updates)
const validateGuideUpdate = [
  // Basic fields (optional for update)
  body('name')
    .optional()
    .trim(),

  body('gender')
    .optional(),

  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)'),

  body('nic')
    .optional()
    .trim(),

  body('contact')
    .optional()
    .trim(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  // Arrays - if provided, must have at least one item
  body('languages')
    .optional()
    .isArray({ min: 1 })
    .withMessage('If languages are provided, you must select at least one'),

  body('availability')
    .optional()
    .isArray({ min: 1 })
    .withMessage('If availability is provided, you must select at least one option'),

  body('coveredLocations')
    .optional()
    .isArray({ min: 1 })
    .withMessage('If covered locations are provided, you must select at least one'),

  // Professional experience - completely optional
  body('experiences')
    .optional()
    .trim(),

  // About You - if provided, must not be empty
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('If you provide an About You section, please write something meaningful')
];

module.exports = {
  validateGuideCreation,
  validateGuideUpdate
};