const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  coveredLocations: {
    type: [String],
    enum: [
      'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
      'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
      'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
      'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
      'Monaragala', 'Ratnapura', 'Kegalle'
    ],
    default: [],
  },
  availability: {
    type: [String],
    enum: ['Weekdays', 'Weekends'],
    default: [],
  },
  languages: {
    type: [String],
    enum: ['English', 'Sinhala', 'Tamil', 'Japanese', 'German', 'French'],
    default: ['English'],
  },
  experiences: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

const Guide = mongoose.models.Guide || mongoose.model('Guide', guideSchema);

module.exports = Guide;