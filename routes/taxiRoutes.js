const express = require('express');
const router = express.Router();
const {
  createTaxiDriver, // Your original function
  createTaxiService,
  getTaxiDrivers,
  getTaxiDriverById,
  searchTaxiDrivers,
  updateTaxiService,
  deleteTaxiService,
  addTaxi,
} = require('../controllers/addtaxi');

// Your original route - keeping it for backward compatibility
router.post('/addTAxi', createTaxiDriver);

// New routes matching accommodation pattern
router.post('/addTaxi', createTaxiService);
router.get('/taxis', getTaxiDrivers);
router.get('/taxi/:id', getTaxiDriverById);
router.post('/taxis/search', searchTaxiDrivers);
router.put('/taxi/:id', updateTaxiService);
router.delete('/taxi/:id', deleteTaxiService);

module.exports = router;