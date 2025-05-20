const express = require('express')
const router = express.Router()
const { createGuide }=require('../controllers/addGuide');

router.post('/addGuide',createGuide);

module.exports = router;
