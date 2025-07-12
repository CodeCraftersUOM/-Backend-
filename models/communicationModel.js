const mongoose = require('mongoose');

const communicationServiceSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  contactPerson: {
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
    lowercase: true,
    trim: true,
  },
  businessRegistration: {
    type: String,
    required: true,
    trim: true,
  },
  yearsInBusiness: {
    type: Number,
    default: 0,
  },
  
  // Service Details
  serviceTypesOffered: {
    type: [String],
    required: true,
    trim: true,
  },
  serviceCoverageArea: {
    type: [String],
    required: true,
    trim: true,
  },
  specialFeatures: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Business Terms
  paymentMethods: {
    type: [String],
    required: true,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment', 'Mobile Payment'],
  },
  currentPromotions: {
    type: String,
    required: true,
    trim: true,
  }
}, { timestamps: true });

const CommunicationService = mongoose.models.CommunicationService || mongoose.model('CommunicationService', communicationServiceSchema);

module.exports = CommunicationService;