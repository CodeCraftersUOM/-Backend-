const mongoose = require('mongoose');

const communicationServiceSchema = new mongoose.Schema({
  serviceTypesOffered: {
    type: [String],
    required: true,
    trim: true,
  },
  serviceSpeed: {
    type: String,
    required: true,
    trim: true,
  },
  serviceCoverageArea: {
    type: [String],
    required: true,
    trim: true,
  },
  pricingDetails: {
    type: String,
    required: true,
    trim: true,
  },
  paymentMethods: {
    type: [String],
    required: true,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Online Payment', 'Mobile Payment'], // add more as needed
  },
  currentPromotions: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

const CommunicationService = mongoose.models.CommunicationService || mongoose.model('CommunicationService', communicationServiceSchema);

module.exports = CommunicationService;
