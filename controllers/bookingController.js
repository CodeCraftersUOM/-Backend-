// controllers/bookingController.js (Create this new file)
const Booking = require("../models/bookingModel");
const AccommodationService = require("../models/accommodationModel"); // Assuming your accommodation model is named this
const { sendBookingNotification, sendCustomerNotification } = require("../utils/notifications");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Basic validation: Ensure accommodation exists and dates are valid
    const accommodation = await AccommodationService.findById(
      bookingData.accommodationId
    );
    if (!accommodation) {
      return res
        .status(404)
        .json({ success: false, error: "Accommodation not found" });
    }

    // You might add more complex availability checks here before saving
    // For now, we'll just save it as 'pending'

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    // 🔔 Send notification to service provider
    try {
      const notificationResult = await sendBookingNotification(
        savedBooking, 
        accommodation, 
        'new_booking'
      );
      console.log('Notification sent:', notificationResult);
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the booking if notification fails
    }

    // In a real system:
    // 1. Notify the service provider (e.g., send an email, push notification, or add to their dashboard)
    // 2. The service provider then logs into their portal to confirm/reject

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

// Get bookings for a service provider (to be used by their website/portal)
exports.getProviderBookings = async (req, res) => {
  try {
    // In a real app, you'd get provider ID from authenticated user
    const { providerId } = req.params; // Assuming providerId is passed in URL
    // You'd need to find accommodations owned by this provider, then bookings for those accommodations
    // For simplicity, let's just fetch all pending bookings for now
    const bookings = await Booking.find({ status: "pending" }).populate(
      "accommodationId"
    ); // Populate accommodation details

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

// Update booking status (used by service provider's website/portal)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // 'confirmed' or 'rejected'

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

    // 🔔 Send notification to customer about status update
    try {
      let notificationType = 'booking_confirmed';
      if (status === 'rejected') notificationType = 'booking_rejected';
      if (status === 'cancelled') notificationType = 'booking_cancelled';
      
      const customerNotificationResult = await sendCustomerNotification(
        booking, 
        notificationType
      );
      console.log('Customer notification sent:', customerNotificationResult);
    } catch (notificationError) {
      console.error('Failed to send customer notification:', notificationError);
      // Don't fail the status update if notification fails
    }

    // If confirmed, you might need to manage room availability
    // If confirmed, you would also notify the customer (e.g., via email or app notification)

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

// Get single booking status (for customer app to poll)
exports.getBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).select("status"); // Only return status

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
