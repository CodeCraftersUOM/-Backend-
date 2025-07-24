const mongoose = require("mongoose");

const vehicleRepairServiceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerFullName: {
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
      trim: true,
      lowercase: true,
    },
    alternateContactNumber: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "Auto Repair Shop",
        "Tire Service",
        "Oil Change",
        "Body Shop",
        "Transmission Repair",
        "Brake Service",
        "Engine Repair",
        "Electrical Service",
        "AC Service",
        "Car Wash & Detailing",
        "Towing Service",
        "Mobile Repair",
        "Multi-Service Garage",
        "Other",
      ],
    },
    locationAddress: {
      type: String,
      required: true,
      trim: true,
    },
    googleMapsLink: {
      type: String,
      trim: true,
    },
    serviceDescription: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    yearsInBusiness: {
      type: Number,
      min: 0,
    },
    numberOfMechanics: {
      type: Number,
      min: 1,
    },
    vehicleCapacity: {
      type: Number,
      min: 1,
    },
    estimatedServiceTime: {
      type: String, // e.g., "2-4 hours", "Same day", "1-2 days"
      trim: true,
    },

    // Operating hours
    operatingHours: {
      monday: { open: String, close: String, closed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
      friday: { open: String, close: String, closed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, closed: { type: Boolean, default: true } },
    },

    is24x7Service: {
      type: Boolean,
      default: false,
    },
    emergencyService: {
      type: Boolean,
      default: false,
    },

    // Pricing
    averageServiceCost: {
      type: Number,
      min: 0,
    },
    diagnosticFee: {
      type: Number,
      min: 0,
    },

    // Certifications and licenses
    businessLicenseNumber: {
      type: String,
      trim: true,
    },
    certifications: [String], // Array of certifications
    insuranceNumber: {
      type: String,
      trim: true,
    },

    // Vehicle types serviced
    vehicleTypesServiced: {
      cars: { type: Boolean, default: true },
      motorcycles: { type: Boolean, default: false },
      trucks: { type: Boolean, default: false },
      vans: { type: Boolean, default: false },
      buses: { type: Boolean, default: false },
      heavyMachinery: { type: Boolean, default: false },
      electricVehicles: { type: Boolean, default: false },
      hybridVehicles: { type: Boolean, default: false },
    },

    // Services offered
    servicesOffered: {
      engineRepair: { type: Boolean, default: false },
      brakeService: { type: Boolean, default: false },
      transmissionRepair: { type: Boolean, default: false },
      oilChange: { type: Boolean, default: false },
      tireService: { type: Boolean, default: false },
      batteryService: { type: Boolean, default: false },
      acService: { type: Boolean, default: false },
      electricalRepair: { type: Boolean, default: false },
      bodyWork: { type: Boolean, default: false },
      paintWork: { type: Boolean, default: false },
      inspection: { type: Boolean, default: false },
      diagnostics: { type: Boolean, default: false },
      tuneUp: { type: Boolean, default: false },
      exhaustSystem: { type: Boolean, default: false },
      suspensionRepair: { type: Boolean, default: false },
      alignmentService: { type: Boolean, default: false },
      detailing: { type: Boolean, default: false },
      towingService: { type: Boolean, default: false },
    },

    // Facilities and amenities
    facilities: {
      waitingArea: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      parkingSpace: { type: Boolean, default: false },
      customerRestroom: { type: Boolean, default: false },
      beverageService: { type: Boolean, default: false },
      pickupDropService: { type: Boolean, default: false },
      loanerCars: { type: Boolean, default: false },
      onlineBooking: { type: Boolean, default: false },
      paymentOptions: {
        cash: { type: Boolean, default: true },
        card: { type: Boolean, default: false },
        digitalPayment: { type: Boolean, default: false },
        insurance: { type: Boolean, default: false },
      },
    },

    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "temporarily_closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
vehicleRepairServiceSchema.index({ locationAddress: 1, serviceType: 1 });
vehicleRepairServiceSchema.index({ rating: -1, averageServiceCost: 1 });
vehicleRepairServiceSchema.index({ status: 1 });

const VehicleRepairService =
  mongoose.models.VehicleRepairService ||
  mongoose.model("VehicleRepairService", vehicleRepairServiceSchema);

module.exports = VehicleRepairService;