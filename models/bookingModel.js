// models/bookingModel.js (Create this new file)
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    accommodationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccommodationService", // Reference to your AccommodationService model
      required: true,
    },
    accommodationName: {
      // Storing name directly for simplicity
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    roomType: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    // Add more fields as needed, e.g., paymentStatus, serviceProviderNotes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
