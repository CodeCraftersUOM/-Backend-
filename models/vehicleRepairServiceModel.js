const mongoose = require("mongoose");

const vehicleRepairServiceSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    garageName: {
      type: String,
      required: true,
      trim: true,
    },
    typeOfService: {
      type: String,
      enum: [
        "Garage",
        "Mobile Mechanic",
        "24/7 Roadside Assistance",
        "Specialized Service Center",
      ],
      required: true,
    },
    registrationOrLicenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    yearsInOperation: {
      type: Number,
      required: true,
      min: 0,
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    serviceCoverageArea: {
      type: String,
      required: true,
      trim: true,
    },
    weekdayWeekendSchedule: {
      type: String,
      required: true,
    },
    isAvailable24_7: {
      type: Boolean,
      default: false,
    },
    vehicleTypesSupported: [
      {
        type: String,
        enum: ["Cars", "Vans", "Buses", "Motorbikes", "Trucks"],
        required: true,
      },
    ],
    languagesAvailable: {
      sinhala: { type: Boolean, default: false },
      tamil: { type: Boolean, default: false },
      english: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleRepairService", vehicleRepairServiceSchema);
