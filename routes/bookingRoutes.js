const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Route to create a new booking (from customer app)
router.post("/bookings", bookingController.createBooking);

// Routes for service provider to manage bookings (typically part of a secure provider API)
router.get(
  "/provider/bookings/:providerId",
  bookingController.getProviderBookings
); // Get all bookings for a provider
router.put(
  "/bookings/:bookingId/status",
  bookingController.updateBookingStatus
); // Update status (confirm/reject)

// Route for customer app to check status
router.get("/bookings/:bookingId/status", bookingController.getBookingStatus);

module.exports = router;
