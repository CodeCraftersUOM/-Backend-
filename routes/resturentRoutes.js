const express = require('express');
const router = express.Router();
const { createRestaurant,  getRestaurant, getAllRestaurants} = require('../controllers/addresturent');


// Create a new restaurant with validation
router.post('/addRestaurant', createRestaurant);

// Get single restaurant (no validation needed)
router.get('/restaurant/:id', getRestaurant);

// Get all restaurants (no validation needed)
router.get('/restaurants', getAllRestaurants);

// Delete restaurant (only need to validate ID)


module.exports = router;
