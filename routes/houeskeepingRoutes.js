const express = require('express')
const router = express.Router()
const  createHouseKepping =require('../controllers/addhousekeeping');

router.post('/addhousekeeping',createHouseKepping.createHousekeepingLaundryService);

module.exports = router;
