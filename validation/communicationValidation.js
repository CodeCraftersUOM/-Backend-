const { body } = require('express-validator');

// Valid payment methods as per model
const validPaymentMethods = [
  'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment', 'Mobile Payment'
];

// ✅ YOUR VALIDATION RULES - Simple and Clean
const validateCommunicationServiceCreation = [
  // Company Information
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required')
    .trim(),

  body('contactPerson')
    .notEmpty()
    .withMessage('Contact person is required')
    .trim(),

  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .trim(),

  body('emailAddress')
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // ✅ YOUR RULE: Business Registration number is mandatory
  body('businessRegistration')
    .notEmpty()
    .withMessage('Business Registration number is mandatory')
    .trim(),

  body('yearsInBusiness')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years in business must be a positive number'),

  // ✅ YOUR RULE: Service Types Offered is mandatory
  body('serviceTypesOffered')
    .notEmpty()
    .withMessage('Service Types Offered is mandatory')
    .isArray({ min: 1 })
    .withMessage('At least one service type must be provided'),

  // ✅ YOUR RULE: Service Coverage Area is mandatory
  body('serviceCoverageArea')
    .notEmpty()
    .withMessage('Service Coverage Area is mandatory')
    .isArray({ min: 1 })
    .withMessage('At least one coverage area must be provided'),

  // ✅ YOUR RULE: Special features are mandatory
  body('specialFeatures')
    .notEmpty()
    .withMessage('Special features are mandatory')
    .trim(),

  // ✅ YOUR RULE: Payment method is mandatory
  body('paymentMethods')
    .notEmpty()
    .withMessage('Payment method is mandatory')
    .isArray({ min: 1 })
    .withMessage('At least one payment method must be provided')
    .custom((methods) => {
      const invalidMethods = methods.filter(method => !validPaymentMethods.includes(method));
      if (invalidMethods.length > 0) {
        throw new Error(`Invalid payment methods: ${invalidMethods.join(', ')}`);
      }
      return true;
    }),

  // ✅ YOUR RULE: Current promotions are mandatory
  body('currentPromotions')
    .notEmpty()
    .withMessage('Current promotions are mandatory')
    .trim()
];

// Update validation (same rules but optional)
const validateCommunicationServiceUpdate = [
  body('companyName')
    .optional()
    .trim(),

  body('contactPerson')
    .optional()
    .trim(),

  body('phoneNumber')
    .optional()
    .trim(),

  body('emailAddress')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('businessRegistration')
    .optional()
    .trim(),

  body('yearsInBusiness')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years in business must be a positive number'),

  body('serviceTypesOffered')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one service type must be provided'),

  body('serviceCoverageArea')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one coverage area must be provided'),

  body('specialFeatures')
    .optional()
    .trim(),

  body('paymentMethods')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one payment method must be provided')
    .custom((methods) => {
      const invalidMethods = methods.filter(method => !validPaymentMethods.includes(method));
      if (invalidMethods.length > 0) {
        throw new Error(`Invalid payment methods: ${invalidMethods.join(', ')}`);
      }
      return true;
    }),

  body('currentPromotions')
    .optional()
    .trim()
];

module.exports = {
  validateCommunicationServiceCreation,
  validateCommunicationServiceUpdate,
  validPaymentMethods
};