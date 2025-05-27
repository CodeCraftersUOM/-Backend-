const AccommodationService = require("../models/accommodationModel");

const createAccommodationService = async (req, res) => {
  try {
    const serviceData = req.body;

    // Create new accommodation service document
    const newService = new AccommodationService({
      ...serviceData,
    });

    // Save to database
    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      data: savedService,
    });
  } catch (error) {
    console.error("Error creating accommodation service:", error); // Keep console log for server-side debugging

    // Handle Mongoose Validation Errors
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: "Validation Failed",
        details: errors,
      });
    }

    // Handle duplicate key errors (if any field is marked unique in the schema)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        // Use 409 Conflict for duplicate
        success: false,
        error: `${field} already exists`,
      });
    }

    // Handle other unexpected errors
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = { createAccommodationService };
