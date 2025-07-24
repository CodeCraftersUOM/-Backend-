# 📱 Mobile Push Notification Integration Guide

## Overview
Your backend now supports mobile push notifications that are automatically sent when accommodation bookings are confirmed or rejected. The system uses MongoDB to store device tokens and notification history.

## 🔧 Setup Required

### 1. Database Models Created:
- `DeviceToken` - Stores mobile device tokens for push notifications
- `PushNotification` - Stores push notification history

### 2. New API Endpoints:

#### Device Token Management:
```
POST /api/device-token/register
POST /api/device-token/unregister  
GET /api/device-tokens/:userId
```

#### Push Notification History:
```
GET /api/push-notifications/:userId
PUT /api/push-notifications/:notificationId/read
```

#### Testing:
```
POST /api/test-push-notification
```

---

## 📱 Mobile App Integration

### 1. Register Device Token (When user logs in)
```javascript
// When user logs into mobile app
const registerDeviceToken = async (userId, deviceToken, platform, deviceId) => {
  try {
    const response = await fetch('http://localhost:2000/api/device-token/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        deviceToken: deviceToken,
        platform: platform, // 'ios' or 'android'
        deviceId: deviceId
      })
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Device token registered successfully');
    }
  } catch (error) {
    console.error('Failed to register device token:', error);
  }
};
```

### 2. Unregister Device Token (When user logs out)
```javascript
const unregisterDeviceToken = async (deviceToken) => {
  try {
    const response = await fetch('http://localhost:2000/api/device-token/unregister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceToken: deviceToken
      })
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Device token unregistered successfully');
    }
  } catch (error) {
    console.error('Failed to unregister device token:', error);
  }
};
```

### 3. Get Push Notification History
```javascript
const getPushNotifications = async (userId, page = 1) => {
  try {
    const response = await fetch(`http://localhost:2000/api/push-notifications/${userId}?page=${page}&limit=20`);
    const result = await response.json();
    
    if (result.success) {
      return result.data; // Array of push notifications
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
};
```

---

## 🔄 How It Works

### When Booking Status Changes:

1. **Provider confirms/rejects booking** via dashboard
2. **Backend automatically:**
   - Updates booking status in database
   - Sends email to customer
   - **🔥 Sends push notification to customer's mobile app**
   - Stores notification history in database

### Notification Flow:
```
Booking Status Update → Email + Push Notification → Mobile App Receives Notification
```

---

## 🧪 Testing Push Notifications

### Test with curl:
```bash
# 1. Register a test device token
curl -X POST http://localhost:2000/api/device-token/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "64f7b1234567890abcdef123",
    "deviceToken": "test_device_token_123",
    "platform": "android",
    "deviceId": "device_123"
  }'

# 2. Send test push notification
curl -X POST http://localhost:2000/api/test-push-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "64f7b1234567890abcdef123",
    "title": "Test Notification",
    "message": "This is a test push notification",
    "data": {"test": true}
  }'

# 3. Check push notification history
curl http://localhost:2000/api/push-notifications/64f7b1234567890abcdef123
```

---

## 🔥 Automatic Triggers

### Push notifications are automatically sent when:

1. **Booking Confirmed** ✅
   - Title: "✅ Booking Confirmed!"
   - Message: "Your booking for [date] has been confirmed! Get ready for your trip."

2. **Booking Rejected** ❌
   - Title: "❌ Booking Rejected"
   - Message: "Your booking request for [date] was not approved. Check other available options."

3. **Booking Cancelled** 🚫
   - Title: "🚫 Booking Cancelled"
   - Message: "Your booking for [date] has been cancelled."

---

## 📱 Mobile App Requirements

### For your mobile app to receive push notifications:

1. **Implement Firebase FCM or similar push service**
2. **Get device token** when user logs in
3. **Register token** with backend using the API
4. **Handle incoming notifications** in your app
5. **Update UI** when notifications are received

### Example React Native Setup:
```javascript
import messaging from '@react-native-firebase/messaging';

// Get device token
const getDeviceToken = async () => {
  const token = await messaging().getToken();
  return token;
};

// Register with backend
const registerForNotifications = async (userId) => {
  const deviceToken = await getDeviceToken();
  const deviceId = DeviceInfo.getUniqueId();
  const platform = Platform.OS; // 'ios' or 'android'
  
  await registerDeviceToken(userId, deviceToken, platform, deviceId);
};
```

---

## 🔐 Security Notes

1. **Device tokens are unique** - Each device has its own token
2. **Tokens expire** - Handle token refresh in your mobile app
3. **User authentication** - Ensure only authenticated users can register tokens
4. **Data validation** - All inputs are validated before storage

---

## 📊 Database Structure

### DeviceToken Collection:
```javascript
{
  userId: ObjectId,
  deviceToken: String,
  platform: 'ios' | 'android',
  deviceId: String,
  isActive: Boolean,
  lastUsed: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### PushNotification Collection:
```javascript
{
  userId: ObjectId,
  bookingId: ObjectId,
  type: 'booking_confirmed' | 'booking_rejected' | 'booking_cancelled',
  title: String,
  message: String,
  data: Object,
  status: 'sent' | 'failed',
  deviceTokensUsed: Array,
  sentAt: Date,
  readAt: Date,
  isRead: Boolean,
  createdAt: Date
}
```

---

## 🚀 Next Steps

1. **Set up Firebase/FCM** in your mobile app
2. **Implement device token registration** on app login
3. **Test push notifications** using the test endpoint
4. **Handle notification clicks** in your mobile app
5. **Add notification UI** to show push history

Your backend is now ready to send push notifications automatically when bookings are confirmed or rejected! 🎉
