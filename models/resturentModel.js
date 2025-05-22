const mongoose = require('mongoose');

const restaurantServiceSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerFullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  alternateContactNumber: {
    type: String,
    trim: true,
  },
  businessType: {
    type: String,
    required: true,
    enum: ['Dine-in', 'Takeaway', 'Delivery Only', 'Cloud Kitchen', 'Cafe/Bakery'],
  },
  locationAddress: {
    type: String,
    required: true,
    trim: true,
  },
  googleMapsLink: {
    type: String,
    trim: true,
  },
  cuisineTypes: {
    type: [String],
    required: true,
    enum: [
      'Indian',
      'Chinese',
      'Italian',
      'Continental',
      'Fast Food',
      'Street Food',
      'BBQ/Grill',
      'Seafood',
      'Vegan/Vegetarian',
      'Desserts/Bakery',
      'Others',
    ],
  },
  workingHours: {
    daysOpen: {
      type: [String],
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    openingTime: {
      type: String,
      required: true,
      trim: true,
    },
    closingTime: {
      type: String,
      required: true,
      trim: true,
    },
    is24x7Available: {
      type: Boolean,
      required: true,
    },
    closedOnHolidays: {
      type: Boolean,
      required: true,
    },
  },
  foodSafetyLicenseUrl: {
    type: String, // File path or URL
    trim: true,
  },
  businessRegistrationNumber: {
    type: String,
    trim: true,
  },
  yearsInOperation: {
    type: Number,
    min: 0,
  },
  numberOfBranches: {
    type: Number,
    min: 0,
  },
  amenities: {
    outdoorSeating: {
      type: Boolean,
      default: false,
    },
    liveMusic: {
      type: Boolean,
      default: false,
    },
    parkingAvailable: {
      type: Boolean,
      default: false,
    },
    wifi: {
      type: Boolean,
      default: false,
    },
    familyAreaKidsFriendly: {
      type: Boolean,
      default: false,
    },
    wheelchairAccessible: {
      type: Boolean,
      default: false,
    },
  },
}, { timestamps: true });

const RestaurantService = mongoose.models.RestaurantService || mongoose.model('RestaurantService', restaurantServiceSchema);

module.exports = RestaurantService;
