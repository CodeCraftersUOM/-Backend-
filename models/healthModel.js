const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  licenseNumber: {
    type: String,
    trim: true,
  },
  profileImageUrl: {
    type: String,
    trim: true,
  }
});

const healthServiceSchema = new mongoose.Schema({
  facilityName: {
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
    lowercase: true,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Clinic', 'Hospital', 'Diagnostic Lab', 'Pharmacy', 'Mental Health Center', 'Telemedicine', 'Home Care', 'Dentist', 'Other'],
  },
  specialties: {
    type: [String],
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  googleMapsLink: {
    type: String,
    trim: true,
  },
  workingHours: {
    daysOpen: {
      type: [String],
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    openingTime: { type: String, required: true, trim: true },
    closingTime: { type: String, required: true, trim: true },
    emergencyAvailable: { type: Boolean, default: false },
    onCallAvailable: { type: Boolean, default: false },
  },
  doctors: [doctorSchema],
  registrationNumber: {
    type: String,
    trim: true,
  },
  licenseDocuments: {
    type: [String], // URLs or file paths
    trim: true,
  },
  yearsInOperation: {
    type: Number,
    default: 0,
  },
  facilitiesAvailable: {
    type: [String],
    trim: true,
  },
  termsAgreed: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const HealthService = mongoose.models.HealthService || mongoose.model('HealthService', healthServiceSchema);

module.exports = HealthService;
