
const express = require('express');
const router = express.Router();
const {
  createCommunicationService,
  updateCommunicationService,
  getCommunicationService,
  getAllCommunicationServices,
  deleteCommunicationService
} = require('../controllers/addCommuni');

const { 
  validateCommunicationServiceCreation, 
  validateCommunicationServiceUpdate 
} = require('../validation/communicationValidation');
const { handleValidationErrors } = require('../validation/validationErrorHandler');

// Create communication service with validation
router.post('/addCommuni',
  validateCommunicationServiceCreation,
  handleValidationErrors,
  createCommunicationService
);

// Update communication service with validation
router.put('/updateCommuni/:id',
  validateCommunicationServiceUpdate,
  handleValidationErrors,
  updateCommunicationService
);

// Get single communication service
router.get('/communi/:id', getCommunicationService);

// Get all communication services with filtering
router.get('/communis', getAllCommunicationServices);

// Delete communication service
router.delete('/communi/:id', deleteCommunicationService);

module.exports = router;
