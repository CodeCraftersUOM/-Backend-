const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Get all notifications
router.get("/notifications", notificationController.getNotifications);

// Get unread notifications only
router.get("/notifications/unread", notificationController.getUnreadNotifications);

// Mark notification as read
router.put("/notifications/:notificationId/read", notificationController.markAsRead);

// Get notification statistics
router.get("/notifications/stats", notificationController.getNotificationStats);

module.exports = router;
