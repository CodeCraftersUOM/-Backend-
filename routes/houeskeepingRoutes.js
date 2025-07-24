const express = require('express');
const router = express.Router();
const {
  createHousekeepingLaundryService,
  getHousekeepingServices,
  getHousekeepingServiceById,
  searchHousekeepingServices,
  updateHousekeepingService,
  deleteHousekeepingService,
} = require('../controllers/addhousekeeping');

// Create new housekeeping service
router.post('/addhousekeeping', createHousekeepingLaundryService);

// Get all housekeeping services (with pagination)
router.get('/housekeeping', getHousekeepingServices);

// Get single housekeeping service by ID
router.get('/housekeeping/:id', getHousekeepingServiceById);

// Search housekeeping services
router.get('/housekeeping/search', searchHousekeepingServices);

// Update housekeeping service
router.put('/housekeeping/:id', updateHousekeepingService);

// Delete housekeeping service (soft delete)
router.delete('/housekeeping/:id', deleteHousekeepingService);

module.exports = router;