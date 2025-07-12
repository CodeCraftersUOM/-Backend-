const { body, validationResult } = require('express-validator');

// Sri Lankan districts for location validation
const validLocations = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

const validGenders = ['Male', 'Female', 'Other'];
const validAvailability = ['Weekdays', 'Weekends'];
const validLanguages = ['English', 'Sinhala', 'Tamil', 'Japanese', 'German', 'French'];

// Custom validator for Sri Lankan NIC
const validateNIC = (nic) => {
  // Remove spaces and convert to uppercase
  const cleanNIC = nic.replace(/\s+/g, '').toUpperCase();
  
  // Old NIC format: 9 digits + V (e.g., 123456789V)
  const oldNICPattern = /^[0-9]{9}[VX]$/;
  
  // New NIC format: 12 digits (e.g., 200012345678)
  const newNICPattern = /^[0-9]{12}$/;
  
  return oldNICPattern.test(cleanNIC) || newNICPattern.test(cleanNIC);
};

// Custom validator for Sri Lankan phone numbers
const validateSriLankanPhone = (phone) => {
  // Remove spaces, hyphens, and plus signs
  const cleanPhone = phone.replace(/[\s\-\+]/g, '');
  
  // Sri Lankan phone number patterns
  const patterns = [
    /^94[0-9]{9}$/, // +94 format without +
    /^0[0-9]{9}$/, // Local format starting with 0
    /^[0-9]{10}$/, // 10 digit format
    /^[0-9]{9}$/ // 9 digit format
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};

// Custom validator for age (must be 18 or older)
const validateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

// Guide creation validation rules
const validateGuideCreation = [
  // Name validation
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name can only contain letters, spaces, dots, hyphens, and apostrophes')
    .trim(),

  // Gender validation
  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(validGenders)
    .withMessage(`Gender must be one of: ${validGenders.join(', ')}`),

  // Date of birth validation
  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom(validateAge)
    .withMessage('Guide must be at least 18 years old')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        throw new Error('Date of birth cannot be in the future');
      }
      return true;
    }),

  // NIC validation
  body('nic')
    .notEmpty()
    .withMessage('NIC is required')
    .custom(validateNIC)
    .withMessage('Please provide a valid Sri Lankan NIC (e.g., 123456789V or 200012345678)')
    .trim(),

  // Contact validation
  body('contact')
    .notEmpty()
    .withMessage('Contact number is required')
    .custom(validateSriLankanPhone)
    .withMessage('Please provide a valid Sri Lankan phone number')
    .trim(),

  // Email validation
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email is too long'),

  // Covered locations validation
  body('coveredLocations')
    .optional()
    .isArray()
    .withMessage('Covered locations must be an array')
    .custom((locations) => {
      if (locations && locations.length > 0) {
        const invalidLocations = locations.filter(loc => !validLocations.includes(loc));
        if (invalidLocations.length > 0) {
          throw new Error(`Invalid locations: ${invalidLocations.join(', ')}`);
        }
      }
      return true;
    }),

  // Availability validation
  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array')
    .custom((availability) => {
      if (availability && availability.length > 0) {
        const invalidAvailability = availability.filter(avail => !validAvailability.includes(avail));
        if (invalidAvailability.length > 0) {
          throw new Error(`Invalid availability: ${invalidAvailability.join(', ')}`);
        }
      }
      return true;
    }),

  // Languages validation
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array')
    .custom((languages) => {
      if (languages && languages.length > 0) {
        const invalidLanguages = languages.filter(lang => !validLanguages.includes(lang));
        if (invalidLanguages.length > 0) {
          throw new Error(`Invalid languages: ${invalidLanguages.join(', ')}`);
        }
      }
      return true;
    }),

  // Experiences validation
  body('experiences')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Experiences description cannot exceed 1000 characters')
    .trim(),

  // Description validation
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
];

// Guide update validation rules (similar but with optional fields)
const validateGuideUpdate = [
  // Name validation (optional for update)
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name can only contain letters, spaces, dots, hyphens, and apostrophes')
    .trim(),

  // Gender validation (optional for update)
  body('gender')
    .optional()
    .isIn(validGenders)
    .withMessage(`Gender must be one of: ${validGenders.join(', ')}`),

  // Date of birth validation (optional for update)
  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom(validateAge)
    .withMessage('Guide must be at least 18 years old')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        throw new Error('Date of birth cannot be in the future');
      }
      return true;
    }),

  // NIC validation (optional for update)
  body('nic')
    .optional()
    .custom(validateNIC)
    .withMessage('Please provide a valid Sri Lankan NIC (e.g., 123456789V or 200012345678)')
    .trim(),

  // Contact validation (optional for update)
  body('contact')
    .optional()
    .custom(validateSriLankanPhone)
    .withMessage('Please provide a valid Sri Lankan phone number')
    .trim(),

  // Email validation (optional for update)
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email is too long'),

  // Other validations same as create but optional
  body('coveredLocations')
    .optional()
    .isArray()
    .withMessage('Covered locations must be an array')
    .custom((locations) => {
      if (locations && locations.length > 0) {
        const invalidLocations = locations.filter(loc => !validLocations.includes(loc));
        if (invalidLocations.length > 0) {
          throw new Error(`Invalid locations: ${invalidLocations.join(', ')}`);
        }
      }
      return true;
    }),

  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array')
    .custom((availability) => {
      if (availability && availability.length > 0) {
        const invalidAvailability = availability.filter(avail => !validAvailability.includes(avail));
        if (invalidAvailability.length > 0) {
          throw new Error(`Invalid availability: ${invalidAvailability.join(', ')}`);
        }
      }
      return true;
    }),

  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array')
    .custom((languages) => {
      if (languages && languages.length > 0) {
        const invalidLanguages = languages.filter(lang => !validLanguages.includes(lang));
        if (invalidLanguages.length > 0) {
          throw new Error(`Invalid languages: ${invalidLanguages.join(', ')}`);
        }
      }
      return true;
    }),

  body('experiences')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Experiences description cannot exceed 1000 characters')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
];

module.exports = {
  validateGuideCreation,
  validateGuideUpdate,
  validLocations,
  validGenders,
  validAvailability,
  validLanguages
};