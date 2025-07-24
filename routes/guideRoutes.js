const express = require('express');
const router = express.Router();
const { createGuide, updateGuide, getGuide, getAllGuides, deleteGuide } = require('../controllers/addGuide');
const { validateGuideCreation, validateGuideUpdate } = require('../validation/guideValidation');
const { handleValidationErrors } = require('../validation/validationErrorHandler');

// Create a new guide with validation
router.post('/addGuide', 
  validateGuideCreation,
  handleValidationErrors,
  createGuide
);

// Update guide with validation (you can add this later)
router.put('/updateGuide/:id',
  validateGuideUpdate,
  handleValidationErrors,
  updateGuide
);

// Get single guide (no validation needed)
router.get('/guide/:id', getGuide);

// Get all guides (no validation needed)
router.get('/guides', getAllGuides);

// Delete guide (only need to validate ID)
router.delete('/guide/:id', deleteGuide);

module.exports = router;