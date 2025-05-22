const CommonService = require('../models/otherModel');

const createCommonService = async (req, res) => {
  try {
    const serviceData = req.body;

    // Create new service document
    const newService = new CommonService(serviceData);

    // Save to database
    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      data: savedService,
    });
  } catch (error) {
    // Handle duplicate key errors (e.g. email or phone uniqueness if enforced)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    // Other errors
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = { createCommonService };
