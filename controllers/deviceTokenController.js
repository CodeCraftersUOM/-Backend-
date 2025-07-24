const DeviceToken = require('../models/deviceTokenModel');
const PushNotification = require('../models/pushNotificationModel');

// Register device token for push notifications
const registerDeviceToken = async (req, res) => {
  try {
    const { userId, deviceToken, platform, deviceId } = req.body;

    // Validation
    if (!userId || !deviceToken || !platform || !deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, deviceToken, platform, deviceId'
      });
    }

    if (!['ios', 'android'].includes(platform)) {
      return res.status(400).json({
        success: false,
        error: 'Platform must be either "ios" or "android"'
      });
    }

    // Check if device token already exists
    let existingToken = await DeviceToken.findOne({ deviceToken });
    
    if (existingToken) {
      // Update existing token
      existingToken.userId = userId;
      existingToken.platform = platform;
      existingToken.deviceId = deviceId;
      existingToken.isActive = true;
      existingToken.lastUsed = new Date();
      
      const updated = await existingToken.save();
      
      return res.status(200).json({
        success: true,
        message: 'Device token updated successfully',
        data: updated
      });
    } else {
      // Create new device token
      const newDeviceToken = new DeviceToken({
        userId,
        deviceToken,
        platform,
        deviceId,
        isActive: true,
        lastUsed: new Date()
      });

      const saved = await newDeviceToken.save();

      return res.status(201).json({
        success: true,
        message: 'Device token registered successfully',
        data: saved
      });
    }

  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({
      success: false,
      error: 'Server error registering device token',
      details: error.message
    });
  }
};

// Unregister device token (when user logs out)
const unregisterDeviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        error: 'Device token is required'
      });
    }

    const result = await DeviceToken.findOneAndUpdate(
      { deviceToken },
      { isActive: false },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Device token not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Device token unregistered successfully',
      data: result
    });

  } catch (error) {
    console.error('Error unregistering device token:', error);
    res.status(500).json({
      success: false,
      error: 'Server error unregistering device token',
      details: error.message
    });
  }
};

// Get push notification history for a user
const getPushNotificationHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await PushNotification.find({ userId })
      .populate('bookingId', 'checkInDate checkOutDate status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PushNotification.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching push notification history:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching notifications',
      details: error.message
    });
  }
};

// Mark push notification as read
const markPushNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await PushNotification.findByIdAndUpdate(
      notificationId,
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating notification',
      details: error.message
    });
  }
};

// Get device tokens for a user (admin endpoint)
const getUserDeviceTokens = async (req, res) => {
  try {
    const { userId } = req.params;

    const deviceTokens = await DeviceToken.find({ userId })
      .sort({ lastUsed: -1 });

    res.status(200).json({
      success: true,
      data: deviceTokens
    });

  } catch (error) {
    console.error('Error fetching device tokens:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching device tokens',
      details: error.message
    });
  }
};

module.exports = {
  registerDeviceToken,
  unregisterDeviceToken,
  getPushNotificationHistory,
  markPushNotificationAsRead,
  getUserDeviceTokens
};
