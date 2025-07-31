const express = require("express");
const router = express.Router();
const { createCardDetail } = require("../controllers/addcard"); // Ensure correct path

// This route will now receive the Stripe Payment Method ID
router.post("/save-stripe-payment-method", createCardDetail); // Updated route name

module.exports = router;