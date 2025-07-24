const mongoose = require('mongoose');

const taxiDriverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  cnic: {
    type: String,
    required: true,
    trim: true,
    unique: true, // To avoid duplicate entries
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  emailAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  profilePhotoUrl: {
    type: String, // URL or file path
    trim: true,
  },
  drivingLicenseNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  licenseExpiryDate: {
    type: Date,
  },
  drivingLicenseUpload: {
    type: String, // URL or file path
    trim: true,
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  vehicleMakeModel: {
    type: String,
    required: true,
    trim: true,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Sedan', 'Mini', 'SUV', 'Van', 'Rickshaw', 'Luxury'],
  },
  vehicleRegistrationNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
  hasAirConditioning: {
    type: Boolean,
    default: false,
  },
  hasLuggageSpace: {
    type: Boolean,
    default: false,
  },
  vehicleImages: {
    type: [String], // Array of image URLs or file paths
    default: [],
  },
  serviceCity: {
    type: String,
    required: true,
    trim: true,
  },
  availableDays: {
    type: [String],
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  availableTimeSlot: {
    type: String,
    required: true,
    trim: true,
  },
  is24x7Available: {
    type: Boolean,
    default: false,
  },
  vehicleRegistrationDocument: {
    type: String, // File path or URL
    trim: true,
  },
  insuranceDocument: {
    type: String, // File path or URL
    trim: true,
  }
}, { timestamps: true });

const TaxiDriver = mongoose.models.TaxiDriver || mongoose.model('TaxiDriver', taxiDriverSchema);

module.exports = TaxiDriver;