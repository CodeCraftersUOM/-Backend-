const specialeventsService = require("../models/specialeventsModel");

// @desc    Create a new special event
// @route   POST /api/specialevents
// @access  Public
const createSpecialEvent = async (req, res) => {
  try {
    const newEvent = new specialeventsService(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json({
      success: true,
      message: "Special event created successfully",
      data: savedEvent,
    });
  } catch (error) {
    console.error("Error creating special event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create special event",
      error: error.message,
    });
  }
};

// @desc    Get all special events
// @route   GET /api/specialevents
// @access  Public
const getAllSpecialEvents = async (req, res) => {
  try {
    const events = await specialeventsService.find({});
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching special events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch special events",
      error: error.message,
    });
  }
};

// @desc    Get a single special event by ID
// @route   GET /api/specialevents/:id
// @access  Public
const getSpecialEventById = async (req, res) => {
  try {
    const event = await specialeventsService.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Special event not found",
      });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching special event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch special event",
      error: error.message,
    });
  }
};

// @desc    Update a special event by ID
// @route   PUT /api/specialevents/:id
// @access  Public
const updateSpecialEvent = async (req, res) => {
  try {
    const updatedEvent = await specialeventsService.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Special event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Special event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating special event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update special event",
      error: error.message,
    });
  }
};

// @desc    Delete a special event by ID
// @route   DELETE /api/specialevents/:id
// @access  Public
const deleteSpecialEvent = async (req, res) => {
  try {
    const deletedEvent = await specialeventsService.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Special event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Special event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting special event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete special event",
      error: error.message,
    });
  }
};

module.exports = {
  createSpecialEvent,
  getAllSpecialEvents,
  getSpecialEventById,
  updateSpecialEvent,
  deleteSpecialEvent,
};
