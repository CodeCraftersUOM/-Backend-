const express = require("express");
const router = express.Router();

const {
  createAdventure,
  getAllAdventures,
  getAdventureById,
  updateAdventure,
  deleteAdventure,
} = require("../controllers/adventuresController");

// 🆕 Create a new adventure
router.post("/adventures", createAdventure);

// 📥 Get all adventures
router.get("/adventures", getAllAdventures);

// 🔍 Get a single adventure by ID
router.get("/adventures/:id", getAdventureById);

// ✏️ Update adventure by ID
router.put("/adventures/:id", updateAdventure);

// 🗑️ Delete adventure by ID
router.delete("/adventures/:id", deleteAdventure);

module.exports = router;
