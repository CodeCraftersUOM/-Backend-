const express = require("express");
const router = express.Router();
const createAccommodation = require("../controllers/addAccommodation");
const { getAccommodation } = require("../controllers/addAccommodation");

router.post(
  "/addAccommodation",
  createAccommodation.createAccommodationService
);

// Define the GET route
router.get("/getAccommodation", getAccommodation);

module.exports = router;
