const AccommodationService = require("../models/accommodationModel");

const createAccommodationService = async (req, res) => {
  try {
    const serviceData = req.body;
    const newService = new AccommodationService({ ...serviceData });
    const savedService = await newService.save();
    res.status(201).json({ success: true, data: savedService });
  } catch (error) {
    console.error("Error creating accommodation service:", error);
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res
        .status(400)
        .json({ success: false, error: "Validation Failed", details: errors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(409)
        .json({ success: false, error: `${field} already exists` });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getAccommodation = async (req, res) => {
  try {
    const accommodations = await AccommodationService.find();
    res.status(200).json({ success: true, data: accommodations });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getAccommodationById = async (req, res) => {
  try {
    const { id } = req.params;
    const accommodation = await AccommodationService.findById(id);
    if (!accommodation) {
      return res
        .status(404)
        .json({ success: false, error: "Accommodation not found" });
    }
    res.status(200).json({ success: true, data: accommodation });
  } catch (error) {
    console.error("Error fetching accommodation by ID:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const searchAccommodations = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, minRating, location, propertyType } =
      req.body;
    let filter = {};
    if (query) {
      filter.$or = [
        { accommodationName: { $regex: query, $options: "i" } },
        { propertyDescription: { $regex: query, $options: "i" } },
      ];
    }
    if (location) {
      filter.locationAddress = { $regex: location, $options: "i" };
    }
    if (propertyType) {
      filter.propertyType = propertyType;
    }
    if (minPrice != null || maxPrice != null) {
      filter.minPricePerNight = {};
      if (minPrice != null) filter.minPricePerNight.$gte = minPrice;
      if (maxPrice != null) filter.minPricePerNight.$lte = maxPrice;
    }
    if (minRating != null) {
      filter.starRating = { $gte: minRating };
    }
    const accommodations = await AccommodationService.find(filter);
    res.status(200).json({ success: true, data: accommodations });
  } catch (error) {
    console.error("Error searching accommodations:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error during search" });
  }
};

const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, error: "Rating must be between 1 and 5." });
    }
    const accommodation = await AccommodationService.findById(id);
    if (!accommodation) {
      return res
        .status(404)
        .json({ success: false, error: "Accommodation not found" });
    }
    const oldRatingTotal = accommodation.starRating * accommodation.reviewCount;
    const newReviewCount = accommodation.reviewCount + 1;
    accommodation.starRating = (oldRatingTotal + rating) / newReviewCount;
    accommodation.reviewCount = newReviewCount;
    const savedService = await accommodation.save();
    res.status(200).json({ success: true, data: savedService });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  createAccommodationService,
  getAccommodation,
  getAccommodationById,
  searchAccommodations,
  addRating,
};
