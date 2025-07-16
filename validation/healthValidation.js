const { body, validationResult } = require('express-validator');

// Valid service types as per model enum
const validServiceTypes = [
  'Clinic', 'Hospital', 'Diagnostic Lab', 'Pharmacy', 'Mental Health Center', 
  'Telemedicine', 'Home Care', 'Dentist', 'Other'
];

// Valid days of the week
const validDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Common medical specialties
const commonSpecialties = [
  'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Gynecology', 'Psychiatry', 'Oncology', 'Radiology', 'Pathology',
  'General Medicine', 'Surgery', 'Emergency Medicine', 'Family Medicine',
  'Internal Medicine', 'Anesthesiology', 'Ophthalmology', 'ENT',
  'Urology', 'Gastroenterology', 'Endocrinology', 'Nephrology',
  'Pulmonology', 'Rheumatology', 'Infectious Diseases', 'General Surgery'
];

// Common facilities
const commonFacilities = [
  'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'ECG', 'Blood Test Lab',
  'Pharmacy', 'Emergency Room', 'ICU', 'Operating Theater', 'Ambulance',
  'Parking', 'Wheelchair Access', 'Laboratory', 'Consultation Rooms',
  'Waiting Area', 'Reception', 'Cashier', 'Medical Records'
];

// Custom validator for Sri Lankan phone numbers
const validateSriLankanPhone = (phone) => {
  const cleanPhone = phone.replace(/[\s\-\+]/g, '');
  const patterns = [
    /^94[0-9]{9}$/, // +94 format without +
    /^0[0-9]{9}$/, // Local format starting with 0
    /^[0-9]{10}$/, // 10 digit format
    /^[0-9]{9}$/ // 9 digit format
  ];
  return patterns.some(pattern => pattern.test(cleanPhone));
};

// Custom validator for time format (HH:MM or HH:MM AM/PM)
const validateTimeFormat = (time) => {
  const timePattern24 = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 24-hour format
  const timePattern12 = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i; // 12-hour format
  return timePattern24.test(time) || timePattern12.test(time);
};

// Custom validator for Google Maps link
const validateGoogleMapsLink = (link) => {
  const googleMapsPattern = /^https:\/\/(www\.)?google\.(com|lk)\/maps/;
  const googleShortenedPattern = /^https:\/\/goo\.gl\/maps/;
  const googleMapsSharePattern = /^https:\/\/maps\.app\.goo\.gl/;
  
  return googleMapsPattern.test(link) || 
         googleShortenedPattern.test(link) || 
         googleMapsSharePattern.test(link);
};

// Custom validator for license number format (Sri Lankan medical license)
const validateMedicalLicense = (license) => {
  // Basic pattern for Sri Lankan medical license (adjust as needed)
  const licensePattern = /^[A-Z0-9\-\/]{5,20}$/;
  return licensePattern.test(license);
};

// Custom validator for registration number
const validateRegistrationNumber = (regNumber) => {
  // Basic pattern for facility registration number
  const regPattern = /^[A-Z0-9\-\/]{3,25}$/;
  return regPattern.test(regNumber);
};

// Custom validator for doctors array
const validateDoctorsArray = (doctors) => {
  if (!Array.isArray(doctors)) {
    throw new Error('Doctors must be an array');
  }
  
  // Check each doctor object
  doctors.forEach((doctor, index) => {
    if (!doctor.fullName || doctor.fullName.trim().length < 2) {
      throw new Error(`Doctor ${index + 1}: Full name is required and must be at least 2 characters`);
    }
    
    if (!doctor.specialty || doctor.specialty.trim().length < 2) {
      throw new Error(`Doctor ${index + 1}: Specialty is required`);
    }
    
    if (!doctor.experienceYears || doctor.experienceYears < 0 || doctor.experienceYears > 60) {
      throw new Error(`Doctor ${index + 1}: Experience years must be between 0 and 60`);
    }
    
    if (doctor.licenseNumber && !validateMedicalLicense(doctor.licenseNumber)) {
      throw new Error(`Doctor ${index + 1}: Invalid license number format`);
    }
    
    if (doctor.profileImageUrl && !isValidUrl(doctor.profileImageUrl)) {
      throw new Error(`Doctor ${index + 1}: Invalid profile image URL`);
    }
  });
  
  return true;
};

// Helper function to validate URLs
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Health service creation validation rules
const validateHealthServiceCreation = [
  // Facility name validation
  body('facilityName')
    .notEmpty()
    .withMessage('Facility name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Facility name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-\.,'&]+$/)
    .withMessage('Facility name contains invalid characters')
    .trim(),

  // Owner full name validation
  body('ownerFullName')
    .notEmpty()
    .withMessage('Owner full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Owner name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\.'-]+$/)
    .withMessage('Owner name can only contain letters, spaces, dots, hyphens, and apostrophes')
    .trim(),

  // Contact phone validation
  body('contactPhone')
    .notEmpty()
    .withMessage('Contact phone is required')
    .custom(validateSriLankanPhone)
    .withMessage('Please provide a valid Sri Lankan phone number')
    .trim(),

  // Contact email validation
  body('contactEmail')
    .notEmpty()
    .withMessage('Contact email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email is too long'),

  // Alternate phone validation (optional)
  body('alternatePhone')
    .optional()
    .custom(validateSriLankanPhone)
    .withMessage('Please provide a valid Sri Lankan phone number for alternate contact')
    .trim(),

  // Service type validation
  body('serviceType')
    .notEmpty()
    .withMessage('Service type is required')
    .isIn(validServiceTypes)
    .withMessage(`Service type must be one of: ${validServiceTypes.join(', ')}`),

  // Specialties validation
  body('specialties')
    .notEmpty()
    .withMessage('Specialties are required')
    .isArray({ min: 1 })
    .withMessage('At least one specialty must be provided')
    .custom((specialties) => {
      const hasEmptyValues = specialties.some(spec => !spec || spec.trim() === '');
      if (hasEmptyValues) {
        throw new Error('Specialties cannot be empty');
      }
      
      const uniqueSpecs = [...new Set(specialties)];
      if (uniqueSpecs.length !== specialties.length) {
        throw new Error('Duplicate specialties are not allowed');
      }
      
      return true;
    }),

  // Landmark validation (optional)
  body('landmark')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Landmark cannot exceed 200 characters')
    .trim(),

  // Google Maps link validation (optional)
  body('googleMapsLink')
    .optional()
    .custom(validateGoogleMapsLink)
    .withMessage('Please provide a valid Google Maps link')
    .trim(),

  // Working hours - days open validation
  body('workingHours.daysOpen')
    .notEmpty()
    .withMessage('Working days are required')
    .isArray({ min: 1 })
    .withMessage('At least one working day must be specified')
    .custom((days) => {
      const invalidDays = days.filter(day => !validDays.includes(day));
      if (invalidDays.length > 0) {
        throw new Error(`Invalid days: ${invalidDays.join(', ')}`);
      }
      
      const uniqueDays = [...new Set(days)];
      if (uniqueDays.length !== days.length) {
        throw new Error('Duplicate days are not allowed');
      }
      
      return true;
    }),

  // Opening time validation
  body('workingHours.openingTime')
    .notEmpty()
    .withMessage('Opening time is required')
    .custom(validateTimeFormat)
    .withMessage('Please provide a valid time format (HH:MM or HH:MM AM/PM)')
    .trim(),

  // Closing time validation
  body('workingHours.closingTime')
    .notEmpty()
    .withMessage('Closing time is required')
    .custom(validateTimeFormat)
    .withMessage('Please provide a valid time format (HH:MM or HH:MM AM/PM)')
    .trim(),

  // Emergency available validation (optional boolean)
  body('workingHours.emergencyAvailable')
    .optional()
    .isBoolean()
    .withMessage('Emergency available must be true or false'),

  // On call available validation (optional boolean)
  body('workingHours.onCallAvailable')
    .optional()
    .isBoolean()
    .withMessage('On call available must be true or false'),

  // Doctors validation (optional)
  body('doctors')
    .optional()
    .custom(validateDoctorsArray),

  // Registration number validation (optional)
  body('registrationNumber')
    .optional()
    .custom(validateRegistrationNumber)
    .withMessage('Please provide a valid registration number')
    .trim(),

  // License documents validation (optional)
  body('licenseDocuments')
    .optional()
    .isArray()
    .withMessage('License documents must be an array')
    .custom((documents) => {
      if (documents && documents.length > 0) {
        const invalidUrls = documents.filter(doc => !isValidUrl(doc));
        if (invalidUrls.length > 0) {
          throw new Error('All license documents must be valid URLs');
        }
      }
      return true;
    }),

  // Years in operation validation (optional)
  body('yearsInOperation')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Years in operation must be between 0 and 100'),

  // Facilities available validation (optional)
  body('facilitiesAvailable')
    .optional()
    .isArray()
    .withMessage('Facilities available must be an array')
    .custom((facilities) => {
      if (facilities && facilities.length > 0) {
        const hasEmptyValues = facilities.some(facility => !facility || facility.trim() === '');
        if (hasEmptyValues) {
          throw new Error('Facilities cannot be empty');
        }
        
        const uniqueFacilities = [...new Set(facilities)];
        if (uniqueFacilities.length !== facilities.length) {
          throw new Error('Duplicate facilities are not allowed');
        }
      }
      return true;
    }),

  // Terms agreed validation
  body('termsAgreed')
    .notEmpty()
    .withMessage('Terms agreement is required')
    .isBoolean()
    .withMessage('Terms agreed must be true or false')
    .custom((value) => {
      if (value !== true) {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    })
];

// Health service update validation rules (similar but optional)
const validateHealthServiceUpdate = [
  // All fields optional for update but with same validation rules
  body('facilityName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Facility name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-\.,'&]+$/)
    .withMessage('Facility name contains invalid characters')
    .trim(),

  body('ownerFullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Owner name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\.'-]+$/)
    .withMessage('Owner name can only contain letters, spaces, dots, hyphens, and apostrophes')
    .trim(),

  body('contactPhone')
    .optional()
    .custom(validateSriLankanPhone)
    .withMessage('Please provide a valid Sri Lankan phone number')
    .trim(),

  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email is too long'),

  body('alternatePhone')
    .optional()
    .custom(validateSriLankanPhone)
    .withMessage('Please provide a valid Sri Lankan phone number for alternate contact')
    .trim(),

  body('serviceType')
    .optional()
    .isIn(validServiceTypes)
    .withMessage(`Service type must be one of: ${validServiceTypes.join(', ')}`),

  body('specialties')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one specialty must be provided')
    .custom((specialties) => {
      const hasEmptyValues = specialties.some(spec => !spec || spec.trim() === '');
      if (hasEmptyValues) {
        throw new Error('Specialties cannot be empty');
      }
      
      const uniqueSpecs = [...new Set(specialties)];
      if (uniqueSpecs.length !== specialties.length) {
        throw new Error('Duplicate specialties are not allowed');
      }
      
      return true;
    }),

  body('landmark')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Landmark cannot exceed 200 characters')
    .trim(),

  body('googleMapsLink')
    .optional()
    .custom(validateGoogleMapsLink)
    .withMessage('Please provide a valid Google Maps link')
    .trim(),

  body('workingHours.daysOpen')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one working day must be specified')
    .custom((days) => {
      const invalidDays = days.filter(day => !validDays.includes(day));
      if (invalidDays.length > 0) {
        throw new Error(`Invalid days: ${invalidDays.join(', ')}`);
      }
      
      const uniqueDays = [...new Set(days)];
      if (uniqueDays.length !== days.length) {
        throw new Error('Duplicate days are not allowed');
      }
      
      return true;
    }),

  body('workingHours.openingTime')
    .optional()
    .custom(validateTimeFormat)
    .withMessage('Please provide a valid time format (HH:MM or HH:MM AM/PM)')
    .trim(),

  body('workingHours.closingTime')
    .optional()
    .custom(validateTimeFormat)
    .withMessage('Please provide a valid time format (HH:MM or HH:MM AM/PM)')
    .trim(),

  body('workingHours.emergencyAvailable')
    .optional()
    .isBoolean()
    .withMessage('Emergency available must be true or false'),

  body('workingHours.onCallAvailable')
    .optional()
    .isBoolean()
    .withMessage('On call available must be true or false'),

  body('doctors')
    .optional()
    .custom(validateDoctorsArray),

  body('registrationNumber')
    .optional()
    .custom(validateRegistrationNumber)
    .withMessage('Please provide a valid registration number')
    .trim(),

  body('licenseDocuments')
    .optional()
    .isArray()
    .withMessage('License documents must be an array')
    .custom((documents) => {
      if (documents && documents.length > 0) {
        const invalidUrls = documents.filter(doc => !isValidUrl(doc));
        if (invalidUrls.length > 0) {
          throw new Error('All license documents must be valid URLs');
        }
      }
      return true;
    }),

  body('yearsInOperation')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Years in operation must be between 0 and 100'),

  body('facilitiesAvailable')
    .optional()
    .isArray()
    .withMessage('Facilities available must be an array')
    .custom((facilities) => {
      if (facilities && facilities.length > 0) {
        const hasEmptyValues = facilities.some(facility => !facility || facility.trim() === '');
        if (hasEmptyValues) {
          throw new Error('Facilities cannot be empty');
        }
        
        const uniqueFacilities = [...new Set(facilities)];
        if (uniqueFacilities.length !== facilities.length) {
          throw new Error('Duplicate facilities are not allowed');
        }
      }
      return true;
    }),

  body('termsAgreed')
    .optional()
    .isBoolean()
    .withMessage('Terms agreed must be true or false')
];

module.exports = {
  validateHealthServiceCreation,
  validateHealthServiceUpdate,
  validServiceTypes,
  validDays,
  commonSpecialties,
  commonFacilities
};