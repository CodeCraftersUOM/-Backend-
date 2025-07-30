const TaxiDriver = require("../models/taxiModel");

const createTaxiDriver = async (req, res) => {
  try {
    const driverData = req.body;

    // Create and save new driver
    const newDriver = new TaxiDriver(driverData);
    const savedDriver = await newDriver.save();

    res.status(201).json({
      success: true,
      message: "Taxi driver registered successfully",
      data: savedDriver,
    });
  } catch (error) {
    console.error("Error creating taxi driver:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists.`,
      });
    }

    // Handle all other errors
    res.status(500).json({
      success: false,
      error: "Server error. Could not register taxi driver.",
    });
  }
};

const getTaxiDrivers = async (req, res) => {
  try {
    const taxiDrivers = await TaxiDriver.find(); // Fetch all taxi drivers
    res.status(200).json({
      success: true,
      data: taxiDrivers,
    });
  } catch (error) {
    console.error("Error fetching taxi drivers:", error);
    res.status(500).json({
      success: false,
      error: "Server error. Could not fetch taxi drivers.",
    });
  }
};

module.exports = { createTaxiDriver, getTaxiDrivers };
