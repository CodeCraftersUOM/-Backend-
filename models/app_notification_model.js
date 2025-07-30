// models/app_notification_model.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
        "booking_completed",
        "new_booking",
        "new_message",
        "promotion",
        "other",
      ],
      default: "booking_status",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    paymentLink: {
      // Add this new field
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
