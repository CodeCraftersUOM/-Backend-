const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/app_notification_controller");

// Get notifications for a specific user
router.get(
  "/notifications/:userId",
  notificationController.getUserNotifications
);

// Mark a notification as read
router.put(
  "/notifications/:notificationId/read",
  notificationController.markNotificationAsRead
);

module.exports = router;
