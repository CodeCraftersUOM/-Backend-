const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format errors for better readability
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
      errorCount: formattedErrors.length
    });
  }
  
  // If no errors, proceed to next middleware
  next();
};

// Alternative error handler that groups errors by field
const handleValidationErrorsGrouped = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const groupedErrors = {};
    
    errors.array().forEach(error => {
      if (!groupedErrors[error.path]) {
        groupedErrors[error.path] = [];
      }
      groupedErrors[error.path].push({
        message: error.msg,
        value: error.value
      });
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: groupedErrors,
      errorCount: errors.array().length
    });
  }
  
  next();
};

// Custom error handler for specific validation scenarios
const handleValidationErrorsCustom = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Check for specific error types
    const errorArray = errors.array();
    const duplicateErrors = errorArray.filter(error => 
      error.msg.includes('already exists') || error.msg.includes('duplicate')
    );
    
    if (duplicateErrors.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate data found',
        errors: duplicateErrors,
        errorType: 'DUPLICATE_ERROR'
      });
    }
    
    // General validation errors
    return res.status(400).json({
      success: false,
      message: 'Invalid input data',
      errors: errorArray.map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      })),
      errorType: 'VALIDATION_ERROR'
    });
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  handleValidationErrorsGrouped,
  handleValidationErrorsCustom
};