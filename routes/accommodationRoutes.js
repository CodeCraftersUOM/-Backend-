const express = require("express");
const router = express.Router();
const {
  createAccommodationService,
  getAccommodation,
  getAccommodationById, // ADD THIS LINE
  searchAccommodations, // ADD THIS LINE for completeness, based on controller
} = require("../controllers/addAccommodation");

router.post("/addAccommodation", createAccommodationService);
router.get("/accommodations", getAccommodation);
router.get("/accommodations/:id", getAccommodationById); // NEW ROUTE
router.post("/accommodations/search", searchAccommodations); // NEW ROUTE for completeness

module.exports = router;
