const express = require("express");
const router = express.Router();
const {
  createSpecialEvent,
  getAllSpecialEvents,
  getSpecialEventById,
  updateSpecialEvent,
  deleteSpecialEvent,
} = require("../controllers/specialeventsController");

// @route   POST /api/specialevents
router.post("/specialevents", createSpecialEvent);

// @route   GET /api/specialevents
router.get("/specialevents", getAllSpecialEvents);

// @route   GET /api/specialevents/:id
router.get("/specialevents:id", getSpecialEventById);

// @route   PUT /api/specialevents/:id
router.put("/specialevents:id", updateSpecialEvent);

// @route   DELETE /api/specialevents/:id
router.delete("/specialevents:id", deleteSpecialEvent);

module.exports = router;
