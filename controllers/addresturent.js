const RestaurantService = require('../models/resturentModel');

const createRestaurantService = async (req, res) => {
  try {
    const serviceData = req.body;

    // Create new restaurant service document
    const newService = new RestaurantService({
      ...serviceData
    });

    // Save to database
    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      data: savedService
    });
  } catch (error) {
    // Handle duplicate key errors (if any field is marked unique in the schema)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    }

    // Handle other errors
    console.error('Error creating restaurant service:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { createRestaurantService };
