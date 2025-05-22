const express = require('express')
const router = express.Router()
const  createOther =require('../controllers/addother');

router.post('/addOther',createOther.createCommonService);

module.exports = router;
