const mongoose = require('mongoose');

const vehicleRepairServiceSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerFullName: {
    type: String,
    required: true,
    trim: true,
  },
  businessPhoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  businessEmailAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  businessWebsite: {
    type: String,
    trim: true,
  },
  businessDescription: {
    type: String,
    required: true,
    trim: true,
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
  servicesOffered: {
    type: [String],
    required: true,
    trim: true,
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
  },
  businessRegistrationNumber: {
    type: String,
    trim: true,
  },
  licenseDocumentUrl: {
    type: String, // Assume this will store a URL or file path
    trim: true,
  },
  termsAgreed: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const VehicleRepairService = mongoose.models.VehicleRepairService || mongoose.model('VehicleRepairService', vehicleRepairServiceSchema);

module.exports = VehicleRepairService;
 