const express = require('express')
const router = express.Router()
const  createTaxi =require('../controllers/addtaxi');

router.post('/addTAxi',createTaxi.createTaxiDriver);

module.exports = router;
