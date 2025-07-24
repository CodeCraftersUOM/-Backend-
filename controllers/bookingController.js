// controllers/bookingController.js
const Booking = require("../models/bookingModel");
const AccommodationService = require("../models/accommodationModel");
const Notification = require("../models/app_notification_model");
const {
  sendBookingNotification,
  sendCustomerNotification,
} = require("../utils/notifications");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Validate required fields
    const requiredFields = [
      "accommodationId",
      "customerEmail",
      "customerName",
      "customerUserId",
    ];
    const missingFields = requiredFields.filter((field) => !bookingData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Basic validation: Ensure accommodation exists and dates are valid
    const accommodation = await AccommodationService.findById(
      bookingData.accommodationId
    );
    if (!accommodation) {
      return res
        .status(404)
        .json({ success: false, error: "Accommodation not found" });
    }

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    // Create notification for customer about booking submission
    try {
      const customerNotification = new Notification({
        userId: savedBooking.customerUserId,
        title: "Booking Submitted",
        message: `Your booking request for ${savedBooking.accommodationName} has been submitted and is awaiting confirmation.`,
        type: "new_booking",
        bookingId: savedBooking._id,
      });
      await customerNotification.save();
      console.log("Customer notification created:", customerNotification);
    } catch (notificationError) {
      console.error(
        "Failed to create customer notification:",
        notificationError
      );
    }

    // Send notification to service provider
    try {
      const notificationResult = await sendBookingNotification(
        savedBooking,
        accommodation,
        "new_booking"
      );
      console.log("Provider notification sent:", notificationResult);
    } catch (notificationError) {
      console.error("Failed to send provider notification:", notificationError);
    }

    res.status(201).json({
      success: true,
      message: "Booking request sent to service provider.",
      data: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      error: "Server error during booking creation",
      details: error.message,
    });
  }
};

// Get bookings for a service provider
exports.getProviderBookings = async (req, res) => {
  try {
    const { providerId } = req.params;
    const bookings = await Booking.find({ status: "pending" }).populate(
      "accommodationId"
    );

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching bookings",
      details: error.message,
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["confirmed", "rejected", "cancelled", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid booking status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: status },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    // Create notification for customer about status update
    try {
      let notificationType = "booking_confirmed";
      let title = "Booking Confirmed!";
      let message = `Your booking for ${
        booking.accommodationName
      } from ${new Date(
        booking.checkInDate
      ).toLocaleDateString()} to ${new Date(
        booking.checkOutDate
      ).toLocaleDateString()} has been confirmed.`;

      if (status === "rejected") {
        notificationType = "booking_rejected";
        title = "Booking Rejected";
        message = `Unfortunately, your booking for ${
          booking.accommodationName
        } from ${new Date(
          booking.checkInDate
        ).toLocaleDateString()} to ${new Date(
          booking.checkOutDate
        ).toLocaleDateString()} has been rejected.`;
      }
      if (status === "cancelled") {
        notificationType = "booking_cancelled";
        title = "Booking Cancelled";
        message = `Your booking for ${
          booking.accommodationName
        } from ${new Date(
          booking.checkInDate
        ).toLocaleDateString()} to ${new Date(
          booking.checkOutDate
        ).toLocaleDateString()} has been cancelled.`;
      }
      if (status === "completed") {
        notificationType = "booking_completed";
        title = "Booking Completed";
        message = `Your stay at ${booking.accommodationName} has been completed. Thank you for choosing our service!`;
      }

      // Create and save the notification in the database
      const newNotification = new Notification({
        userId: booking.customerUserId,
        title: title,
        message: message,
        type: notificationType,
        bookingId: booking._id,
      });
      await newNotification.save();
      console.log("Notification saved to DB:", newNotification);

      // Optionally, send external notifications (push notifications/emails)
      const customerNotificationResult = await sendCustomerNotification(
        booking,
        notificationType
      );
      console.log(
        "Customer external notification sent:",
        customerNotificationResult
      );
    } catch (notificationError) {
      console.error("Failed to send customer notification:", notificationError);
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating booking status",
      details: error.message,
    });
  }
};

// Get single booking status
exports.getBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).select("status");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    res.status(200).json({ success: true, status: booking.status });
  } catch (error) {
    console.error("Error fetching booking status:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching booking status",
      details: error.message,
    });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ customerUserId: userId })
      .populate("accommodationId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching user bookings",
      details: error.message,
    });
  }
};
