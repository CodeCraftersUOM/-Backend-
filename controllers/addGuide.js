const Guide = require('../models/Services-guideModel');

// Create a new guide
const createGuide = async (req, res) => {
  try {
    const guideData = req.body;
    
    // Check if guide with same email or NIC already exists
    const existingGuide = await Guide.findOne({
      $or: [
        { email: guideData.email },
        { nic: guideData.nic }
      ]
    });
    
    if (existingGuide) {
      const duplicateField = existingGuide.email === guideData.email ? 'email' : 'nic';
      return res.status(409).json({
        success: false,
        message: `Guide with this ${duplicateField} already exists`,
        duplicateField: duplicateField
      });
    }
    
    // Create new guide
    const newGuide = new Guide({
      ...guideData,
      dob: new Date(guideData.dob), // Ensure proper date formatting
      // Set default values if not provided
      coveredLocations: guideData.coveredLocations || [],
      availability: guideData.availability || [],
      languages: guideData.languages || ['English']
    });
    
    // Save to database
    const savedGuide = await newGuide.save();
    
    res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      data: savedGuide
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        duplicateField: field
      });
    }
    
    // Handle other errors
    console.error('Error creating guide:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update guide
const updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if guide exists
    const existingGuide = await Guide.findById(id);
    if (!existingGuide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }
    
    // Check for duplicate email or NIC if they're being updated
    if (updateData.email || updateData.nic) {
      const duplicateQuery = {
        _id: { $ne: id }, // Exclude current guide
        $or: []
      };
      
      if (updateData.email) {
        duplicateQuery.$or.push({ email: updateData.email });
      }
      if (updateData.nic) {
        duplicateQuery.$or.push({ nic: updateData.nic });
      }
      
      const duplicateGuide = await Guide.findOne(duplicateQuery);
      if (duplicateGuide) {
        const duplicateField = duplicateGuide.email === updateData.email ? 'email' : 'nic';
        return res.status(409).json({
          success: false,
          message: `Guide with this ${duplicateField} already exists`,
          duplicateField: duplicateField
        });
      }
    }
    
    // Update guide
    const updatedGuide = await Guide.findByIdAndUpdate(
      id,
      {
        ...updateData,
        dob: updateData.dob ? new Date(updateData.dob) : existingGuide.dob
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Guide updated successfully',
      data: updatedGuide
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        duplicateField: field
      });
    }
    
    console.error('Error updating guide:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single guide
const getGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findById(id);
    
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }
    
    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all guides
const getAllGuides = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, language, availability } = req.query;
    
    // Build filter object
    const filter = {};
    if (location) filter.coveredLocations = location;
    if (language) filter.languages = language;
    if (availability) filter.availability = availability;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch guides with filters and pagination
    const guides = await Guide.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Guide.countDocuments(filter);
    
    res.json({
      success: true,
      data: guides,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalGuides: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete guide
const deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedGuide = await Guide.findByIdAndDelete(id);
    
    if (!deletedGuide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Guide deleted successfully',
      data: deletedGuide
    });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createGuide,
  updateGuide,
  getGuide,
  getAllGuides,
  deleteGuide
};