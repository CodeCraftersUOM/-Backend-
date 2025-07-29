const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    match: /^[a-zA-Z\s.]+$/
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Cardiology', 'Dermatology', 'Emergency Medicine', 'Family Medicine',
      'Internal Medicine', 'Neurology', 'Orthopedics', 'Pediatrics',
      'Psychiatry', 'Surgery', 'Gynecology', 'Oncology', 'Radiology', 'Anesthesiology'
    ]
  },
  experienceYears: {
    type: Number,
    required: true,
    min: 1,
    max: 60
  },
  licenseNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: /^(MD[0-9]{4,6}|SLMC[0-9]{4,6}|[0-9]{4,6})$/
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^0[1-9][0-9]{8}$/
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    match: /^[a-zA-Z\s.]+$/
  },
  state: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Western', 'Central', 'Southern', 'Northern', 'Eastern',
      'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
    ]
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{5}$/
  },
  medicalSchool: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  graduationYear: {
    type: Number,
    required: true
  },
  certifications: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  profileImageUrl: {
    type: String,
    trim: true,
  }
}, { 
  timestamps: true 
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
