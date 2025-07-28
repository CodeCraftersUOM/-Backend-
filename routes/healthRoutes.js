const express = require('express');
const router = express.Router();
const {
  createHealthService,
  updateHealthService,
  getHealthService,
  getAllHealthServices,
  deleteHealthService,
  getHealthServicesBySpecialty,
  getEmergencyServices,
  searchHealthServices // Import the new search function
} = require('../controllers/addhealth');

// Note: Your validation middleware can be added back here if needed.
// const { validateHealthServiceCreation, validateHealthServiceUpdate } = require('../validation/healthValidation');
// const { handleValidationErrors } = require('../validation/validationErrorHandler');

// Standardized routes to match other features
const baseRoute = '/health-services';

// Create health service
router.post(baseRoute, createHealthService);

// Get all health services
router.get(baseRoute, getAllHealthServices);

// Search for health services (NEW - using POST)
router.post(`${baseRoute}/search`, searchHealthServices);

// Get single health service by ID
router.get(`${baseRoute}/:id`, getHealthService);

// Update health service
router.put(`${baseRoute}/:id`, updateHealthService);

// Delete health service
router.delete(`${baseRoute}/:id`, deleteHealthService);

// Original specific routes are kept for any other potential use
router.get('/healths/specialty/:specialty', getHealthServicesBySpecialty);
router.get('/healths/emergency', getEmergencyServices);

module.exports = router;
