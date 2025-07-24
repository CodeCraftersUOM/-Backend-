const { getWebNotifications, markNotificationAsRead } = require("../utils/notifications");

// Get all notifications for web dashboard
const getNotifications = async (req, res) => {
  try {
    const { providerId } = req.query; // Optional filter by provider
    const notifications = getWebNotifications(providerId);
    
    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter(n => !n.read).length
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching notifications",
      details: error.message,
    });
  }
};

// Get only unread notifications
const getUnreadNotifications = async (req, res) => {
  try {
    const { providerId } = req.query;
    const allNotifications = getWebNotifications(providerId);
    const unreadNotifications = allNotifications.filter(n => !n.read);
    
    res.status(200).json({
      success: true,
      data: unreadNotifications,
      count: unreadNotifications.length
    });
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching unread notifications",
      details: error.message,
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = markNotificationAsRead(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating notification",
      details: error.message,
    });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const { providerId } = req.query;
    const notifications = getWebNotifications(providerId);
    
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      read: notifications.filter(n => n.read).length,
      byType: {}
    };
    
    // Count by notification type
    notifications.forEach(n => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    });
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching notification statistics",
      details: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  getNotificationStats
};
