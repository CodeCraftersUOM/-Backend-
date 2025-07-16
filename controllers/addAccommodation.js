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
    console.error("Error creating accommodation service:", error);

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

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Get all accommodations
const getAccommodation = async (req, res) => {
  try {
    const accommodations = await AccommodationService.find();
    res.status(200).json({
      success: true,
      data: accommodations,
    });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Get a single accommodation by its ID
// addAccommodation.js
const getAccommodationById = async (req, res) => {
  try {
    const { id } = req.params;
    const accommodation = await AccommodationService.findById(id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: "Accommodation not found",
      });
    }

    // Add this log to inspect the data before sending
    console.log("Accommodation data fetched by ID");

    res.status(200).json({
      success: true,
      data: accommodation,
    });
  } catch (error) {
    console.error("Error fetching accommodation by ID:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// NEW: Search and filter accommodations
const searchAccommodations = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, minRating, location, propertyType } =
      req.body;

    let filter = {};

    // Text search for name and description
    if (query) {
      filter.$or = [
        {
          accommodationName: {
            $regex: query,
            $options: "i",
          },
        },
        {
          propertyDescription: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    // Location search
    if (location) {
      filter.locationAddress = {
        $regex: location,
        $options: "i",
      };
    }

    // Property type filter
    if (propertyType) {
      filter.propertyType = propertyType;
    }

    // Price range filter
    if (minPrice != null || maxPrice != null) {
      filter.minPricePerNight = {};
      if (minPrice != null) {
        filter.minPricePerNight.$gte = minPrice;
      }
      if (maxPrice != null) {
        filter.minPricePerNight.$lte = maxPrice;
      }
    }

    // Minimum rating filter
    if (minRating != null) {
      filter.starRating = {
        $gte: minRating,
      };
    }

    const accommodations = await AccommodationService.find(filter);

    res.status(200).json({
      success: true,
      data: accommodations,
    });
  } catch (error) {
    console.error("Error searching accommodations:", error);
    res.status(500).json({
      success: false,
      error: "Server error during search",
    });
  }
};

// Define addAccommodation as a local function (if needed elsewhere)
const addAccommodation = async (req, res) => {
  res.status(201).json({
    message: "Accommodation added!",
  });
};

module.exports = {
  createAccommodationService,
  getAccommodation,
  addAccommodation,
  getAccommodationById,
  searchAccommodations, // Export the new search function
};
