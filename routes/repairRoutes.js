const express = require('express')
const router = express.Router()
const  createRepair =require('../controllers/addRepair');

router.post('/addRepair',createRepair.createVehicleRepairService);

module.exports = router;
