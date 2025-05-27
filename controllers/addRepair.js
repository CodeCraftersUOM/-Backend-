const VehicleRepairService = require('../models/repairModel');

const createVehicleRepairService = async (req, res) => {
  try {
    const serviceData = req.body;

    // Create new vehicle repair service document
    const newService = new VehicleRepairService({
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
    console.error('Error creating vehicle repair service:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { createVehicleRepairService };
