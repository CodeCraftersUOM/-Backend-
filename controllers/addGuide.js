const Guide = require('../models/Services-guideModel');

const createGuide = async (req, res) => {
  try {
    const guideData = req.body;
    
    // Create new guide
    const newGuide = new Guide({
      ...guideData,
      dob: new Date(guideData.dob) // Ensure proper date formatting
    });

    // Save to database
    const savedGuide = await newGuide.save();

    res.status(201).json({
      success: true,
      data: savedGuide
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    }

    // Handle other errors
    console.error('Error creating guide:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { createGuide };