const { body, validationResult } = require('express-validator');
const { isValid } = require('date-fns');

// Custom NIC validation for Sri Lankan NIC (supports both old and new formats)
const validateNIC = (value) => {
  const oldNicPattern = /^[0-9]{9}[vVxX]$/;
  const newNicPattern = /^[0-9]{12}$/;
  
  if (!oldNicPattern.test(value) && !newNicPattern.test(value)) {
    throw new Error('NIC is invalid. Please enter a valid Sri Lankan NIC');
  }
  return true;
};

// Custom date validation
const validateDOB = (value) => {
  if (!isValid(new Date(value))) {
    throw new Error('Invalid date format');
  }
  if (new Date(value) > new Date()) {
    throw new Error('Date of birth cannot be in the future');
  }
  return true;
};

// Sri Lankan phone number validation
const validateContact = (value) => {
  const phoneRegex = /^(?:\+94|0)[1-9]\d{8}$/;
  if (!phoneRegex.test(value)) {
    throw new Error('Invalid Sri Lankan phone number format');
  }
  return true;
};

exports.createGuideValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),

  body('gender')
    .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),

  body('dob')
    .custom(validateDOB),

  body('nic')
    .trim()
    .custom(validateNIC),

  body('contact')
    .trim()
    .custom(validateContact),

  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('coveredLocations')
    .optional()
    .isArray().withMessage('Covered locations must be an array')
    .custom(values => {
      const validLocations = [
        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
        'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
        'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
        'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
        'Monaragala', 'Ratnapura', 'Kegalle'
      ];
      if (values.some(loc => !validLocations.includes(loc))) {
        throw new Error('Invalid location in covered locations');
      }
      return true;
    }),

  body('availability')
    .optional()
    .isArray().withMessage('Availability must be an array')
    .custom(values => {
      if (values.some(avail => !['Weekdays', 'Weekends'].includes(avail))) {
        throw new Error('Invalid availability value');
      }
      return true;
    }),

  body('languages')
    .optional()
    .isArray().withMessage('Languages must be an array')
    .custom(values => {
      const validLanguages = ['English', 'Sinhala', 'Tamil', 'Japanese', 'German', 'French'];
      if (values.some(lang => !validLanguages.includes(lang))) {
        throw new Error('Invalid language specified');
      }
      return true;
    }),

  body('experiences')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Experiences must be less than 1000 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];