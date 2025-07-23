const adventuresService = require("../models/adventuresModel"); // Assuming you have an adventuresModel

// @desc    Create a new adventure
// @route   POST /api/adventures
// @access  Public
const createAdventure = async (req, res) => {
  try {
    const newAdventure = new adventuresService(req.body);
    const savedAdventure = await newAdventure.save();
    res.status(201).json({
      success: true,
      message: "Adventure created successfully",
      data: savedAdventure,
    });
  } catch (error) {
    console.error("Error creating adventure:", error);
    res.status(501).json({
      success: false,
      message: "Failed to create adventure",
      error: error.message,
    });
  }
};

// @desc    Get all adventures
// @route   GET /api/adventures
// @access  Public
const getAllAdventures = async (req, res) => {
  try {
    const adventures = await adventuresService.find({});
    res.status(200).json({
      success: true,
      data: adventures,
    });
  } catch (error) {
    console.error("Error fetching adventures:", error);
    res.status(502).json({
      success: false,
      message: "Failed to fetch adventures",
      error: error.message,
    });
  }
};

// @desc    Get a single adventure by ID
// @route   GET /api/adventures/:id
// @access  Public
const getAdventureById = async (req, res) => {
  try {
    const adventure = await adventuresService.findById(req.params.id);
    if (!adventure) {
      return res.status(404).json({
        success: false,
        message: "Adventure not found",
      });
    }
    res.status(200).json({
      success: true,
      data: adventure,
    });
  } catch (error) {
    console.error("Error fetching adventure:", error);
    res.status(503).json({
      success: false,
      message: "Failed to fetch adventure",
      error: error.message,
    });
  }
};

// @desc    Update an adventure by ID
// @route   PUT /api/adventures/:id
// @access  Public
const updateAdventure = async (req, res) => {
  try {
    const updatedAdventure = await adventuresService.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose validators on update
    });
    if (!updatedAdventure) {
      return res.status(404).json({
        success: false,
        message: "Adventure not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Adventure updated successfully",
      data: updatedAdventure,
    });
  } catch (error) {
    console.error("Error updating adventure:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update adventure",
      error: error.message,
    });
  }
};

// @desc    Delete an adventure by ID
// @route   DELETE /api/adventures/:id
// @access  Public
const deleteAdventure = async (req, res) => {
  try {
    const deletedAdventure = await adventuresService.findByIdAndDelete(req.params.id);
    if (!deletedAdventure) {
      return res.status(404).json({
        success: false,
        message: "Adventure not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Adventure deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting adventure:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete adventure",
      error: error.message,
    });
  }
};

module.exports = {
  createAdventure,
  getAllAdventures,
  getAdventureById,
  updateAdventure,
  deleteAdventure,
};
