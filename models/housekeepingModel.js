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
  
  // Enhanced pricing structure
  pricing: {
    hourlyRate: {
      type: Number,
      min: 0,
    },
    perSquareFootRate: {
      type: Number,
      min: 0,
    },
    perVisitRate: {
      type: Number,
      min: 0,
    },
    minimumCharge: {
      type: Number,
      min: 0,
    },
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

  // Additional service details
  teamSize: {
    type: Number,
    min: 1,
    default: 1,
  },
  yearsInBusiness: {
    type: Number,
    min: 0,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },

  // Equipment and supplies
  equipmentProvided: {
    cleaningSupplies: { type: Boolean, default: true },
    cleaningEquipment: { type: Boolean, default: true },
    ecoFriendlyProducts: { type: Boolean, default: false },
    disinfectants: { type: Boolean, default: true },
  },

  // Service features
  serviceFeatures: {
    backgroundCheckedStaff: { type: Boolean, default: false },
    insured: { type: Boolean, default: false },
    bonded: { type: Boolean, default: false },
    uniformedStaff: { type: Boolean, default: false },
    flexibleScheduling: { type: Boolean, default: true },
    sameTeamEachVisit: { type: Boolean, default: false },
    satisfactionGuarantee: { type: Boolean, default: false },
    onlineBooking: { type: Boolean, default: false },
  },

  // Payment options
  paymentOptions: {
    cash: { type: Boolean, default: true },
    card: { type: Boolean, default: false },
    digitalPayment: { type: Boolean, default: false },
    monthlyBilling: { type: Boolean, default: false },
  },

  businessRegistrationNumber: {
    type: String,
    trim: true,
  },
  licensesCertificates: {
    type: [String], // Array of file URLs or paths
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'temporarily_closed'],
    default: 'active',
  },

  termsAgreed: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });



const HousekeepingLaundryService = mongoose.models.HousekeepingLaundryService || 
  mongoose.model('HousekeepingLaundryService', housekeepingLaundryServiceSchema);

module.exports = HousekeepingLaundryService;