const express = require("express");
const router = express.Router();

const {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} = require("../controllers/placestovisitController");

// 🆕 Create a new place to visit
router.post("/placestovisit", createPlace);

// 📥 Get all places to visit
router.get("/placestovisit", getAllPlaces);

// 🔍 Get a single place to visit by ID
router.get("/placestovisit/:id", getPlaceById);

// ✏️ Update a place to visit by ID
router.put("/placestovisit/:id", updatePlace);

// 🗑️ Delete a place to visit by ID
router.delete("/placestovisit/:id", deletePlace);

module.exports = router;
