const express = require('express');
const router = express.Router();
const {
  createCommunicationService,
  getAllCommunicationServices,
  getCommunicationService, // CORRECTED: Renamed from getCommunicationServiceById
  searchCommunicationServices,
  updateCommunicationService,
  deleteCommunicationService
} = require('../controllers/addCommuni');

// Standardized routes to match other features

// Create communication service
router.post('/communications', createCommunicationService);

// Get all communication services
router.get('/communications', getAllCommunicationServices);

// Get single communication service by ID
router.get('/communications/:id', getCommunicationService); // CORRECTED: Using the correct function name

// Search for communication services (CHANGED to POST)
router.post('/communications/search', searchCommunicationServices);

// Update communication service
router.put('/communications/:id', updateCommunicationService);

// Delete communication service
router.delete('/communications/:id', deleteCommunicationService);

module.exports = router;
