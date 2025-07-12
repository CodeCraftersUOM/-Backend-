const { body, validationResult } = require('express-validator');

// Valid payment methods as per model
const validPaymentMethods = [
  'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment', 'Mobile Payment'
];

// Common service types for communication (you can expand this list)
const commonServiceTypes = [
  'Internet Service', 'Mobile Service', 'Landline Service', 'Cable TV', 'Satellite TV',
  'Broadband', 'Fiber Optic', 'Wireless Internet', 'VoIP Service', 'Data Plans',
  'International Calling', 'SMS Service', 'Email Service', 'Video Conferencing'
];

// Common Sri Lankan areas (you can expand this list)
const sriLankanAreas = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle',
  // Add more specific areas as needed
  'Mount Lavinia', 'Dehiwala', 'Moratuwa', 'Negombo', 'Panadura',
  'Kelaniya', 'Maharagama', 'Kotte', 'Battaramulla'
];

// Custom validator for service types
const validateServiceTypes = (serviceTypes) => {
  if (!Array.isArray(serviceTypes) || serviceTypes.length === 0) {
    throw new Error('At least one service type must be provided');
  }
  
  // Check for empty strings
  const hasEmptyValues = serviceTypes.some(type => !type || type.trim() === '');
  if (hasEmptyValues) {
    throw new Error('Service types cannot be empty');
  }
  
  // Check for duplicates
  const uniqueTypes = [...new Set(serviceTypes)];
  if (uniqueTypes.length !== serviceTypes.length) {
    throw new Error('Duplicate service types are not allowed');
  }
  
  return true;
};

// Custom validator for coverage areas
const validateCoverageAreas = (areas) => {
  if (!Array.isArray(areas) || areas.length === 0) {
    throw new Error('At least one coverage area must be provided');
  }
  
  // Check for empty strings
  const hasEmptyValues = areas.some(area => !area || area.trim() === '');
  if (hasEmptyValues) {
    throw new Error('Coverage areas cannot be empty');
  }
  
  // Check for duplicates
  const uniqueAreas = [...new Set(areas)];
  if (uniqueAreas.length !== areas.length) {
    throw new Error('Duplicate coverage areas are not allowed');
  }
  
  return true;
};

// Custom validator for payment methods
const validatePaymentMethodsArray = (methods) => {
  if (!Array.isArray(methods) || methods.length === 0) {
    throw new Error('At least one payment method must be provided');
  }
  
  // Check if all methods are valid
  const invalidMethods = methods.filter(method => !validPaymentMethods.includes(method));
  if (invalidMethods.length > 0) {
    throw new Error(`Invalid payment methods: ${invalidMethods.join(', ')}`);
  }
  
  // Check for duplicates
  const uniqueMethods = [...new Set(methods)];
  if (uniqueMethods.length !== methods.length) {
    throw new Error('Duplicate payment methods are not allowed');
  }
  
  return true;
};

// Custom validator for pricing details format
const validatePricingFormat = (pricing) => {
  // Basic validation for pricing format
  const pricingPattern = /^[0-9.,\s\-\/LKRRsUSD$€£¥₹]+.*$/;
  if (!pricingPattern.test(pricing)) {
    throw new Error('Pricing details should include numerical values and currency information');
  }
  return true;
};

// Communication service creation validation rules
const validateCommunicationServiceCreation = [
  // Service types validation
  body('serviceTypesOffered')
    .notEmpty()
    .withMessage('Service types offered is required')
    .custom(validateServiceTypes)
    .customSanitizer((serviceTypes) => {
      // Trim and clean each service type
      return serviceTypes.map(type => type.trim());
    }),

  // Service speed validation
  body('serviceSpeed')
    .notEmpty()
    .withMessage('Service speed is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Service speed must be between 2 and 100 characters')
    .matches(/^[0-9]+\s?(Mbps|Gbps|Kbps|MB\/s|KB\/s|GB\/s).*$/i)
    .withMessage('Service speed should include valid speed units (Mbps, Gbps, Kbps, etc.)')
    .trim(),

  // Service coverage area validation
  body('serviceCoverageArea')
    .notEmpty()
    .withMessage('Service coverage area is required')
    .custom(validateCoverageAreas)
    .customSanitizer((areas) => {
      // Trim and clean each area
      return areas.map(area => area.trim());
    }),

  // Pricing details validation
  body('pricingDetails')
    .notEmpty()
    .withMessage('Pricing details are required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Pricing details must be between 10 and 500 characters')
    .custom(validatePricingFormat)
    .trim(),

  // Payment methods validation
  body('paymentMethods')
    .notEmpty()
    .withMessage('Payment methods are required')
    .custom(validatePaymentMethodsArray),

  // Current promotions validation (optional)
  body('currentPromotions')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Current promotions cannot exceed 300 characters')
    .trim()
];

// Communication service update validation rules
const validateCommunicationServiceUpdate = [
  // Service types validation (optional for update)
  body('serviceTypesOffered')
    .optional()
    .custom(validateServiceTypes)
    .customSanitizer((serviceTypes) => {
      return serviceTypes ? serviceTypes.map(type => type.trim()) : serviceTypes;
    }),

  // Service speed validation (optional for update)
  body('serviceSpeed')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service speed must be between 2 and 100 characters')
    .matches(/^[0-9]+\s?(Mbps|Gbps|Kbps|MB\/s|KB\/s|GB\/s).*$/i)
    .withMessage('Service speed should include valid speed units (Mbps, Gbps, Kbps, etc.)')
    .trim(),

  // Service coverage area validation (optional for update)
  body('serviceCoverageArea')
    .optional()
    .custom(validateCoverageAreas)
    .customSanitizer((areas) => {
      return areas ? areas.map(area => area.trim()) : areas;
    }),

  // Pricing details validation (optional for update)
  body('pricingDetails')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Pricing details must be between 10 and 500 characters')
    .custom(validatePricingFormat)
    .trim(),

  // Payment methods validation (optional for update)
  body('paymentMethods')
    .optional()
    .custom(validatePaymentMethodsArray),

  // Current promotions validation (optional)
  body('currentPromotions')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Current promotions cannot exceed 300 characters')
    .trim()
];

module.exports = {
  validateCommunicationServiceCreation,
  validateCommunicationServiceUpdate,
  validPaymentMethods,
  commonServiceTypes,
  sriLankanAreas
};