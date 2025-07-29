const { body, validationResult } = require('express-validator');

const validateOtherServiceCreation = [
  body('fullNameOrBusinessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  
  body('primaryPhoneNumber')
    .trim()
    .matches(/^(07[0-9]{8}|0[1-9][0-9]{8})$/)
    .withMessage('Primary phone number must be a valid 10-digit number'),
  
  body('emailAddress')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  
  body('typeOfService')
    .trim()
    .notEmpty()
    .withMessage('Service type is required'),
  
  body('listOfServicesOffered')
    .isArray({ min: 1 })
    .withMessage('At least one service must be selected'),
  
  body('pricingMethod')
    .isIn(['Per Hour', 'Per Visit', 'Custom Quote'])
    .withMessage('Invalid pricing method'),
  
  body('availability.availableDays')
    .isArray({ min: 1 })
    .withMessage('At least one available day must be selected'),
  
  body('availability.availableTimeSlots')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Available time slots must be between 5 and 100 characters'),
  
  body('termsAgreed')
    .isBoolean()
    .custom(value => value === true)
    .withMessage('Terms and conditions must be agreed to'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  validateOtherServiceCreation,
  handleValidationErrors
};
