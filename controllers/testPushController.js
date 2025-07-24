const { sendMobilePushNotification, storePushNotification } = require('../utils/notifications');

// Test endpoint to send push notification
const sendTestPushNotification = async (req, res) => {
  try {
    const { userId, title, message, data } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, title, message'
      });
    }

    const pushResult = await sendMobilePushNotification(
      userId,
      title,
      message,
      data || {}
    );

    // Store the test notification
    if (pushResult.success || pushResult.deviceTokensUsed.length > 0) {
      const storeResult = await storePushNotification(
        userId,
        null, // No booking ID for test
        'test_notification',
        title,
        message,
        data || {},
        pushResult
      );
      console.log('Test push notification stored:', storeResult.success);
    }

    res.status(200).json({
      success: true,
      message: 'Test push notification sent',
      data: pushResult
    });

  } catch (error) {
    console.error('Error sending test push notification:', error);
    res.status(500).json({
      success: false,
      error: 'Server error sending test notification',
      details: error.message
    });
  }
};

module.exports = {
  sendTestPushNotification
};
