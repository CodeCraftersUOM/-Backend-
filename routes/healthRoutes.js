const express = require('express')
const router = express.Router()
const  createHelth =require('../controllers/addhealth');

router.post('/addHelth',createHelth.createHealthService);

module.exports = router;
