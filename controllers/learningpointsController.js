const LearningPoint = require("../models/learningpointsModel");

// @desc    Create a new learning point
// @route   POST /api/learningpoints
// @access  Public
const createLearningPoint = async (req, res) => {
  try {
    const newPoint = new LearningPoint(req.body);
    const savedPoint = await newPoint.save();
    res.status(201).json({
      success: true,
      message: "LearningPoint created successfully",
      data: savedPoint,
    });
  } catch (error) {
    console.error("Error creating learning point:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create learning point",
      error: error.message,
    });
  }
};

// @desc    Get all learning points
// @route   GET /api/learningpoints
// @access  Public
const getAllLearningPoints = async (req, res) => {
  try {
    const points = await LearningPoint.find({ category: "learningpoints" });
    res.status(200).json({
      success: true,
      data: points,
    });
  } catch (error) {
    console.error("Error fetching learning points:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning points",
      error: error.message,
    });
  }
};

// @desc    Get a single learning point by ID
// @route   GET /api/learningpoints/:id
// @access  Public
const getLearningPointById = async (req, res) => {
  try {
    const point = await LearningPoint.findById(req.params.id);
    if (!point) {
      return res.status(404).json({
        success: false,
        message: "LearningPoint not found",
      });
    }
    res.status(200).json({
      success: true,
      data: point,
    });
  } catch (error) {
    console.error("Error fetching learning point:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning point",
      error: error.message,
    });
  }
};

// @desc    Update a learning point by ID
// @route   PUT /api/learningpoints/:id
// @access  Public
const updateLearningPoint = async (req, res) => {
  try {
    const updatedPoint = await LearningPoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPoint) {
      return res.status(404).json({
        success: false,
        message: "LearningPoint not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "LearningPoint updated successfully",
      data: updatedPoint,
    });
  } catch (error) {
    console.error("Error updating learning point:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update learning point",
      error: error.message,
    });
  }
};

// @desc    Delete a learning point by ID
// @route   DELETE /api/learningpoints/:id
// @access  Public
const deleteLearningPoint = async (req, res) => {
  try {
    const deletedPoint = await LearningPoint.findByIdAndDelete(req.params.id);
    if (!deletedPoint) {
      return res.status(404).json({
        success: false,
        message: "LearningPoint not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "LearningPoint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting learning point:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete learning point",
      error: error.message,
    });
  }
};

module.exports = {
  createLearningPoint,
  getAllLearningPoints,
  getLearningPointById,
  updateLearningPoint,
  deleteLearningPoint,
};



