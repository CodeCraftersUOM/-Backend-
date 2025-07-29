const mongoose = require("mongoose");

const vehicleRepairSchema = new mongoose.Schema(
  {
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
      match: /^0[1-9][0-9]{8}$/
    },
    businessEmailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    businessWebsite: {
      type: String,
      trim: true,
    },
    businessDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000
    },
    locationAddress: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 200
    },
    googleMapsLink: {
      type: String,
      trim: true,
    },
    servicesOffered: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'At least one service must be selected'
      }
    },
    workingHours: {
      daysOpen: {
        type: [String],
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        validate: {
          validator: function(v) {
            return v.length > 0;
          },
          message: 'At least one working day must be selected'
        }
      },
      openingTime: {
        type: String,
        required: true,
        trim: true
      },
      closingTime: {
        type: String,
        required: true,
        trim: true
      }
    },
    businessRegistrationNumber: {
      type: String,
      trim: true,
    },
    licenseDocumentUrl: {
      type: String,
      trim: true,
    },
    termsAgreed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
);

const VehicleRepairService = mongoose.models.VehicleRepairService || mongoose.model("VehicleRepairService", vehicleRepairSchema);

module.exports = VehicleRepairService; 