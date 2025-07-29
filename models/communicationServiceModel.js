const mongoose = require("mongoose");

const communicationServiceSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceCoverageArea: {
      type: String,
      required: true,
      trim: true,
    },
    licenseOrRegistrationDetails: {
      type: String,
      required: true,
      trim: true,
    },
    customerServicePhoneNumbers: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    socialMediaLinks: {
      facebook: { type: String, default: null },
      instagram: { type: String, default: null },
      twitter: { type: String, default: null },
      whatsapp: { type: String, default: null },
      other: { type: String, default: null },
    },
    physicalOfficeLocations: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: {
          lat: { type: Number, default: null },
          lng: { type: Number, default: null },
        },
      },
    ],
    workingHours: {
      type: String, // Example: "Mon-Fri: 9 AM - 6 PM, Sat: 9 AM - 1 PM"
      required: true,
    },
    customerSupportLanguages: {
      sinhala: { type: Boolean, default: false },
      tamil: { type: Boolean, default: false },
      english: { type: Boolean, default: false },
    },
    isAvailable24_7: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunicationService", communicationServiceSchema);
