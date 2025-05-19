const express = require('express')
router = express.Router()

const loginController = require('../controllers/loginController')


router.get('/login',loginController)

module.exports=router