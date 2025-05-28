const express = require('express')
const router = express.Router()
const  createCard =require('../controllers/addcard');

router.post('/addcard',createCard.createCardDetail);

module.exports = router;
