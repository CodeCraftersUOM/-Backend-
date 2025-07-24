// controllers/notificationController.js
const Notification = require("../models/app_notification_model");

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId: userId }).sort({
      createdAt: -1,
    }); // Sort by newest first
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching notifications",
      details: error.message,
    });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      error: "Server error marking notification as read",
      details: error.message,
    });
  }
};
