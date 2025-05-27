const mongoose = require('mongoose');

const housekeepingLaundryServiceSchema = new mongoose.Schema({
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
  contactPhone: {
    type: String,
    required: true,
    trim: true,
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  websiteUrl: {
    type: String,
    trim: true,
  },
  businessDescription: {
    type: String,
    trim: true,
  },
  serviceTypes: {
    type: [String],
    required: true,
    enum: [
      'Housekeeping (Home/Office)',
      'Deep Cleaning',
      'Carpet Cleaning',
      'Window Cleaning',
      'Laundry & Ironing',
      'Dry Cleaning',
      'Sofa/Chair Cleaning',
      'Disinfection & Sanitization',
    ],
  },
  pricingMethod: {
    type: String,
    required: true,
    enum: ['Per Hour', 'Per Square Foot', 'Per Visit', 'Custom Quote'],
  },
  serviceArea: {
    type: String,
    required: true,
    trim: true,
  },
  addressOrLandmark: {
    type: String,
    trim: true,
  },
  googleMapsLink: {
    type: String,
    trim: true,
  },
  availability: {
    daysAvailable: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyServiceAvailable: {
      type: Boolean,
      default: false,
    }
  },
  businessRegistrationNumber: {
    type: String,
    trim: true,
  },
  licensesCertificates: {
    type: [String], // Array of file URLs or paths
    trim: true,
  },
  termsAgreed: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const HousekeepingLaundryService = mongoose.models.HousekeepingLaundryService || mongoose.model('HousekeepingLaundryService', housekeepingLaundryServiceSchema);

module.exports = HousekeepingLaundryService;
