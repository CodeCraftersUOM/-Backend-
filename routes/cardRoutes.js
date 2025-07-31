const express = require("express");
const router = express.Router();
const { createCardDetail } = require("../controllers/addcard");

// Update the route to match frontend URL
router.post("/cards", createCardDetail);

module.exports = router;