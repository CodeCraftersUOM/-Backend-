const express = require("express");
const router = express.Router();
const {
  createLearningPoint,
  getAllLearningPoints,
  getLearningPointById,
  updateLearningPoint,
  deleteLearningPoint,
} = require("../controllers/learningpointsController");

// @route   POST /api/learningpoints
router.post("/learningpoints", createLearningPoint);

// @route   GET /api/learningpoints
router.get("/learningpoints", getAllLearningPoints);

// @route   GET /api/learningpoints/:id
router.get("/learningpoints:id", getLearningPointById);

// @route   PUT /api/learningpoints/:id
router.put("/learningpoints:id", updateLearningPoint);

// @route   DELETE /api/learningpoints/:id
router.delete("/learningpoints:id", deleteLearningPoint);

module.exports = router;
