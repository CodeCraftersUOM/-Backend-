const express = require('express')
const router = express.Router()
const  createResturent =require('../controllers/addresturent');

router.post('/addresturent',createResturent.createRestaurantService);

module.exports = router;
