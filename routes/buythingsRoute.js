const express = require("express");
const router = express.Router();
const {
  createBuythings,
  getAllBuythings,
  getItemById,
  updateBuythings,
  deleteBuythings,
} = require("../controllers/addBuythings");

const { uploadImages, handleUploadError } = require("../middleware/imageUpload");

// Create a new buythings item
router.post("/buythings", uploadImages, createBuythings);

// Get all buythings
router.get("/buythings", getAllBuythings);

// Get single buythings by ID
router.get("/buythings/:id", getItemById);

// Update buythings by ID
router.put("/buythings/:id", updateBuythings);

router.use(handleUploadError);

// Delete buythings by ID
router.delete("/buythings/:id", deleteBuythings);

module.exports = router;
