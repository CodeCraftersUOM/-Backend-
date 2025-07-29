const mongoose = require('mongoose');

const commonServiceSchema = new mongoose.Schema({
  fullNameOrBusinessName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: {
    type: String,
    trim: true,
  },
  cnicOrNationalId: {
    type: String,
    trim: true,
  },
  businessRegistrationNumber: {
    type: String,
    trim: true,
  },
  primaryPhoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  alternatePhoneNumber: {
    type: String,
    trim: true,
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  whatsappNumber: {
    type: String,
    trim: true,
  },
  websiteUrl: {
    type: String,
    trim: true,
  },
  typeOfService: {
    type: String,
    required: true,
    trim: true,
  },
  listOfServicesOffered: {
    type: [String],
    required: true,
    trim: true,
  },
  pricingMethod: {
    type: String,
    required: true,
    enum: ['Per Hour', 'Per Visit', 'Custom Quote'],
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  availability: {
    availableDays: {
      type: [String],
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    availableTimeSlots: {
      type: String,
      required: true,
      trim: true,
    },
    is24x7Available: {
      type: Boolean,
      default: false,
    },
    emergencyOrOnCallAvailable: {
      type: Boolean,
      default: false,
    },
  },
  termsAgreed: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const CommonService = mongoose.models.CommonService || mongoose.model('CommonService', commonServiceSchema, 'commonservices');

module.exports = CommonService;
