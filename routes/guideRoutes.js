const express = require('express');
const router = express.Router();
const {
  createGuideService,
  getGuides,
  getGuideById,
  searchGuides,
  updateGuideService,
  deleteGuideService,
  addGuide,
} = require('../controllers/addGuide');

// Create a new guide
router.post('/addGuide', createGuideService);

// Get all guides
router.get('/guides', getGuides);

// Get a single guide by ID
router.get('/guide/:id', getGuideById);

// Search guides
router.post('/guides/search', searchGuides);

// Update guide
router.put('/guide/:id', updateGuideService);

// Delete guide
router.delete('/guide/:id', deleteGuideService);

module.exports = router;