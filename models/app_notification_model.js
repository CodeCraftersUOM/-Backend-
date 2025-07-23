// models/notificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you have a User model and users have ObjectIds
      ref: "User", // Reference to your User model (adjust if your user model has a different name)
      //   required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "booking_status",
        "booking_confirmed",
        "booking_rejected",
        "booking_cancelled",
        "new_message",
        "promotion",
        "other",
      ], // Add all used types here
      default: "booking_status",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // You might want to link it to a specific booking or other entity
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false, // Not all notifications might be related to a booking
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
