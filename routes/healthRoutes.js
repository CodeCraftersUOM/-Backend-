const express = require('express');
const router = express.Router();
const {
  createDoctor,
  updateDoctor,
  getDoctor,
  getAllDoctors,
  deleteDoctor,
  getDoctorsBySpecialty,
  getDoctorsByLocation,
  searchDoctors
} = require('../controllers/addhealth');

// Note: Your validation middleware can be added back here if needed.
// const { validateDoctorCreation, validateDoctorUpdate } = require('../validation/healthValidation');
// const { handleValidationErrors } = require('../validation/validationErrorHandler');

// Doctor registration endpoint (matches your frontend API call)
router.post('/addHelth', createDoctor);

// Standardized routes for doctor management
const baseRoute = '/doctors';

// Create doctor
router.post(baseRoute, createDoctor);

// Get all doctors
router.get(baseRoute, getAllDoctors);

// Search for doctors
router.post(`${baseRoute}/search`, searchDoctors);

// Get single doctor by ID
router.get(`${baseRoute}/:id`, getDoctor);

// Update doctor
router.put(`${baseRoute}/:id`, updateDoctor);

// Delete doctor
router.delete(`${baseRoute}/:id`, deleteDoctor);

// Get doctors by specialty
router.get('/doctors/specialty/:specialty', getDoctorsBySpecialty);

// Get doctors by location (fixed - removed optional parameter)
router.get('/doctors/location/:state', getDoctorsByLocation);
router.get('/doctors/location/:state/:city', getDoctorsByLocation);

module.exports = router;
