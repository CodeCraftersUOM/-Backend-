const mongoose = require('mongoose');

const pushNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  type: {
    type: String,
    enum: ['booking_confirmed', 'booking_rejected', 'booking_cancelled', 'new_booking'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'pending'
  },
  deviceTokensUsed: [{
    deviceToken: String,
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'pending'
    },
    errorMessage: String
  }],
  sentAt: Date,
  readAt: Date,
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
pushNotificationSchema.index({ userId: 1, createdAt: -1 });
pushNotificationSchema.index({ bookingId: 1 });
pushNotificationSchema.index({ type: 1 });

const PushNotification = mongoose.model('PushNotification', pushNotificationSchema);

module.exports = PushNotification;
