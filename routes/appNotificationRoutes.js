const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/app_notification_controller");
const deviceTokenController = require("../controllers/deviceTokenController");
const testPushController = require("../controllers/testPushController");

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

// 📱 Mobile Push Notification Routes
// Register device token for push notifications
router.post("/device-token/register", deviceTokenController.registerDeviceToken);

// Unregister device token (logout)
router.post("/device-token/unregister", deviceTokenController.unregisterDeviceToken);

// Get push notification history for a user
router.get("/push-notifications/:userId", deviceTokenController.getPushNotificationHistory);

// Mark push notification as read
router.put("/push-notifications/:notificationId/read", deviceTokenController.markPushNotificationAsRead);

// Get device tokens for a user (admin)
router.get("/device-tokens/:userId", deviceTokenController.getUserDeviceTokens);

// Test push notification endpoint
router.post("/test-push-notification", testPushController.sendTestPushNotification);

module.exports = router;
