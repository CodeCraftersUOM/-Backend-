const HealthService = require('../models/healthModel');

const createHealthService = async (req, res) => {
  try {
    const healthData = req.body;

    // Create new health service document
    const newHealthService = new HealthService(healthData);

    // Save to MongoDB
    const savedHealthService = await newHealthService.save();

    res.status(201).json({
      success: true,
      data: savedHealthService,
    });
  } catch (error) {
    // Handle duplicate key errors (e.g., registration number or email)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    // Handle other server or validation errors
    console.error('Error creating health service:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = { createHealthService };
