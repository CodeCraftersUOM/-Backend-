const RestaurantService = require('../models/resturentModel');

const createRestaurant = async (req, res) => {
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
const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await RestaurantService.findById(id);        
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
        
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, cuisine, priceRange, isOpen } = req.query;
        
    // Build filter object
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    if (cuisine) filter.cuisineTypes = cuisine;
    if (priceRange) filter.priceRange = priceRange;
    if (isOpen !== undefined) filter.isOpen = isOpen === 'true';
        
    // Calculate pagination
    const skip = (page - 1) * limit;
        
    // Fetch restaurants with filters and pagination
    const restaurants = await RestaurantService.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
        
    const total = await RestaurantService.countDocuments(filter);
        
    res.json({
      success: true,
      data: restaurants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRestaurants: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getRestaurant,
  getAllRestaurants,
  createRestaurant 
};


