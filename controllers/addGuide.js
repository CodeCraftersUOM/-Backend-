const Guide = require('../models/Services-guideModel');

// Create a new guide
const createGuideService = async (req, res) => {
  try {
    const guideData = req.body;
    
    // Create new guide document
    const newGuide = new Guide({
      ...guideData,
      dob: new Date(guideData.dob),
      coveredLocations: guideData.coveredLocations || [],
      availability: guideData.availability || [],
      languages: guideData.languages || ['English']
    });
    
    // Save to database
    const savedGuide = await newGuide.save();
    
    res.status(201).json({
      success: true,
      data: savedGuide,
    });
  } catch (error) {
    console.error('Error creating guide:', error);
    
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: 'Validation Failed',
        details: errors,
      });
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `${field} already exists`,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get all guides
const getGuides = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, language, availability } = req.query;
    
    // Build filter object
    const filter = {};
    if (location && location !== 'all') filter.coveredLocations = location;
    if (language && language !== 'all') filter.languages = language;
    if (availability && availability !== 'all') filter.availability = availability;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch guides with filters and pagination
    const guides = await Guide.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Guide.countDocuments(filter);
    
    res.status(200).json({
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
      error: 'Server error',
    });
  }
};

// Get a single guide by its ID
const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findById(id);
    
    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found',
      });
    }
    
    console.log('Guide data fetched by ID:', guide);
    
    res.status(200).json({
      success: true,
      data: guide,
    });
  } catch (error) {
    console.error('Error fetching guide by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Search and filter guides
const searchGuides = async (req, res) => {
  try {
    const { query, location, language, availability, experience } = req.body;
    
    let filter = {};
    
    // Text search for name and description
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { experiences: { $regex: query, $options: 'i' } },
      ];
    }
    
    // Location filter
    if (location && location !== 'all') {
      filter.coveredLocations = location;
    }
    
    // Language filter
    if (language && language !== 'all') {
      filter.languages = language;
    }
    
    // Availability filter
    if (availability && availability !== 'all') {
      filter.availability = availability;
    }
    
    // Experience filter
    if (experience) {
      filter.experiences = { $regex: experience, $options: 'i' };
    }
    
    const guides = await Guide.find(filter);
    
    res.status(200).json({
      success: true,
      data: guides,
    });
  } catch (error) {
    console.error('Error searching guides:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during search',
    });
  }
};

// Update guide
const updateGuideService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingGuide = await Guide.findById(id);
    if (!existingGuide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found',
      });
    }
    
    const updatedGuide = await Guide.findByIdAndUpdate(
      id,
      {
        ...updateData,
        dob: updateData.dob ? new Date(updateData.dob) : existingGuide.dob
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedGuide,
    });
  } catch (error) {
    console.error('Error updating guide:', error);
    
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: 'Validation Failed',
        details: errors,
      });
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `${field} already exists`,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Delete guide
const deleteGuideService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedGuide = await Guide.findByIdAndDelete(id);
    
    if (!deletedGuide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: deletedGuide,
    });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

const addGuide = async (req, res) => {
  res.status(201).json({
    message: 'Guide added!',
  });
};

module.exports = {
  createGuideService,
  getGuides,
  getGuideById,
  searchGuides,
  updateGuideService,
  deleteGuideService,
  addGuide,
};