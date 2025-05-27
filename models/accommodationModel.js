const mongoose = require("mongoose");

const accommodationServiceSchema = new mongoose.Schema(
  {
    accommodationName: {
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
    propertyType: {
      type: String,
      required: true,
      enum: [
        "Hotel",
        "Guest House",
        "Villa",
        "Apartment",
        "Homestay",
        "Resort",
        "Boutique Hotel",
        "Motel",
        "Bed and Breakfast",
        "Other",
      ],
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
    propertyDescription: {
      type: String,
      trim: true,
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    numberOfRooms: {
      type: Number,
      min: 1,
    },
    maxGuests: {
      type: Number,
      min: 1,
    },
    minPricePerNight: {
      type: Number,
      min: 0,
    },
    maxPricePerNight: {
      type: Number,
      min: 0,
    },

    daysAvailable: {
      type: [String],
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    checkInTime: {
      type: String,
      required: true,
      trim: true,
    },
    checkOutTime: {
      type: String,
      required: true,
      trim: true,
    },
    is24x7Reception: {
      type: Boolean,
      default: false,
    },
    closedOnHolidays: {
      type: Boolean,
      default: false,
    },

    tourismLicenseNumber: {
      type: String,
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

    amenities: {
      pool: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      spa: { type: Boolean, default: false },
      restaurantOnSite: { type: Boolean, default: false },
      barLounge: { type: Boolean, default: false }, // Added
      roomService: { type: Boolean, default: false }, // Added
      laundryService: { type: Boolean, default: false }, // Added
      conciergeService: { type: Boolean, default: false }, // Added
      airportTransfer: { type: Boolean, default: false }, // Changed from airportShuttle
      petFriendly: { type: Boolean, default: false },
      eventFacilities: { type: Boolean, default: false }, // Added
      parkingAvailable: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      familyAreaKidsFriendly: { type: Boolean, default: false }, // Added
      wheelchairAccessible: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const AccommodationService =
  mongoose.models.AccommodationService ||
  mongoose.model("AccommodationService", accommodationServiceSchema);

module.exports = AccommodationService;
