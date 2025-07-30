const express = require("express");
const router = express.Router();
const {
  createAccommodationService,
  getAccommodation,
  getAccommodationById,
  searchAccommodations,
  addRating,
} = require("../controllers/addAccommodation");

router.post("/addAccommodation", createAccommodationService);
router.get("/accommodations", getAccommodation);
router.get("/accommodations/:id", getAccommodationById);
router.post("/accommodations/search", searchAccommodations);

// Handles the rating submission from your Flutter app
router.post("/accommodations/:id/ratings", addRating);

module.exports = router;
