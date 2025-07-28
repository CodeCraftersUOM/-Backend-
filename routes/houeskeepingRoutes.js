const express = require('express');
const router = express.Router();
const {
  createHousekeepingLaundryService,
  getHousekeepingServices,
  getHousekeepingServiceById,
  searchHousekeepingServices,
} = require('../controllers/addhousekeeping');

// Create new housekeeping service
router.post('/addhousekeeping', createHousekeepingLaundryService);

// Get all housekeeping services
router.get('/housekeeping', getHousekeepingServices);

// Get single housekeeping service by ID
router.get('/housekeeping/:id', getHousekeepingServiceById);

// Search housekeeping services (CHANGED from GET to POST)
router.post('/housekeeping/search', searchHousekeepingServices);

// You can add update and delete routes here if needed, like so:
// router.put('/housekeeping/:id', updateHousekeepingService);
// router.delete('/housekeeping/:id', deleteHousekeepingService);

module.exports = router;
