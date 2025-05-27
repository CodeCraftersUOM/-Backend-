const express = require("express");
const router = express.Router();
const createAccommodation = require("../controllers/addAccommodation");

router.post(
  "/addAccommodation",
  createAccommodation.createAccommodationService
);

module.exports = router;
