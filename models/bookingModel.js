// models/bookingModel.js (Add customerUserId)
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    accommodationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccommodationService",
      required: true,
    },
    accommodationName: {
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
    customerUserId: {
      // Add this field to link to the user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named 'User'
      // required: true, // Make it required if every booking must have a user
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
