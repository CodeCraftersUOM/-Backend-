const express = require('express')
const router = express.Router()
const  createCommuni =require('../controllers/addCommuni');

router.post('/addCommuni',createCommuni.createCommunicationService);

module.exports = router;
