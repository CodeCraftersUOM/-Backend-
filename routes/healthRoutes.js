const express = require('express');
const router = express.Router();
const {
  createHealthService,
  updateHealthService,
  getHealthService,
  getAllHealthServices,
  deleteHealthService,
  getHealthServicesBySpecialty,
  getEmergencyServices
} = require('../controllers/addhealth');

const { 
  validateHealthServiceCreation, 
  validateHealthServiceUpdate 
} = require('../validation/healthValidation');
const { handleValidationErrors } = require('../validation/validationErrorHandler');

// Create health service with validation
router.post('/addHelth',
  validateHealthServiceCreation,
  handleValidationErrors,
  createHealthService
);

// Update health service with validation
router.put('/updateHealth/:id',
  validateHealthServiceUpdate,
  handleValidationErrors,
  updateHealthService
);

// Get single health service
router.get('/health/:id', getHealthService);

// Get all health services with filtering
router.get('/healths', getAllHealthServices);

// Get health services by specialty
router.get('/healths/specialty/:specialty', getHealthServicesBySpecialty);

// Get emergency services
router.get('/healths/emergency', getEmergencyServices);

// Delete health service
router.delete('/health/:id', deleteHealthService);

module.exports = router;