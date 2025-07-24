const buythingsService = require("../models/buythingsModel");

// @desc    Create a new item
// @route   POST /api/items
// @access  Public
const createBuythings = async (req, res) => {
  try {
    const newItem = new buythingsService(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({
      success: true,
      message: "buythingsService created successfully",
      data: savedItem,
    });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(501).json({
      success: false,
      message: "Failed to create item",
      error: error.message,
    });
  }
};



// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getAllBuythings = async (req, res) => {
  try {
    const items = await buythingsService.find({});
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(502).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await buythingsService.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "buythingsService not found",
      });
    }
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(503).json({
      success: false,
      message: "Failed to fetch item",
      error: error.message,
    });
  }
};

// @desc    Update an item by ID
// @route   PUT /api/items/:id
// @access  Public
const updateBuythings = async (req, res) => {
  try {
    const updatedItem = await buythingsService.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "buythingsService not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "buythingsService updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message,
    });
  }
};

// @desc    Delete an item by ID
// @route   DELETE /api/items/:id
// @access  Public
const deleteBuythings = async (req, res) => {
  try {
    const deletedItem = await buythingsService.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "buythingsService not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "buythingsService deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
};

module.exports = {
  createBuythings,
  getAllBuythings,
  getItemById,
  updateBuythings,
  deleteBuythings,
};
