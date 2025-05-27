const HousekeepingLaundryService = require('../models/housekeepingModel');

const createHousekeepingLaundryService = async (req, res) => {
  try {
    const serviceData = req.body;

    // Create new document
    const newService = new HousekeepingLaundryService(serviceData);

    // Save to MongoDB
    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      data: savedService,
    });
  } catch (error) {
    // Handle duplicate key errors (e.g., email or registration number)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    console.error('Error creating housekeeping/laundry service:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = { createHousekeepingLaundryService };
