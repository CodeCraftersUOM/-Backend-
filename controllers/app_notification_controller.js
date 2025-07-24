// controllers/app_notification_controller.js
const Notification = require("../models/app_notification_model");

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const notifications = await Notification.find({ userId: userId })
      .populate(
        "bookingId",
        "accommodationName checkInDate checkOutDate status"
      )
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
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

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        error: "Notification ID is required",
      });
    }

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

// Mark all notifications as read for a user
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const result = await Notification.updateMany(
      { userId: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      error: "Server error marking notifications as read",
      details: error.message,
    });
  }
};

// Get unread notification count
exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const count = await Notification.countDocuments({
      userId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    res.status(500).json({
      success: false,
      error: "Server error getting notification count",
      details: error.message,
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        error: "Notification ID is required",
      });
    }

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting notification",
      details: error.message,
    });
  }
};
