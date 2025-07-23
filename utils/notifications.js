const nodemailer = require('nodemailer');

// Email transporter (reusing your existing configuration)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dulanjanassd@gmail.com',
    pass: 'duuc onqi xsmm wfph'
  }
});

// In-memory notification storage (in production, use Redis or database)
let webNotifications = [];

// Store notification for web dashboard
const storeWebNotification = (notification) => {
  const webNotification = {
    id: Date.now().toString(),
    ...notification,
    timestamp: new Date(),
    read: false
  };
  webNotifications.push(webNotification);
  
  // Keep only last 100 notifications
  if (webNotifications.length > 100) {
    webNotifications = webNotifications.slice(-100);
  }
  
  return webNotification;
};

// Get unread notifications for web dashboard
const getWebNotifications = (providerId = null) => {
  if (providerId) {
    return webNotifications.filter(n => n.providerId === providerId);
  }
  return webNotifications;
};

// Mark notification as read
const markNotificationAsRead = (notificationId) => {
  const notification = webNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  return notification;
};

// Send email notification
const sendEmailNotification = async (to, subject, content) => {
  try {
    const mailOptions = {
      from: 'dulanjanassd@gmail.com',
      to,
      subject,
      html: content
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send booking notification to service provider
const sendBookingNotification = async (booking, accommodation, type = 'new_booking') => {
  try {
    const notifications = [];
    
    // 1. Store web notification
    const webNotification = storeWebNotification({
      type: type,
      providerId: accommodation.providerId || accommodation.ownerId,
      bookingId: booking._id,
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, booking, accommodation),
      data: {
        booking: booking,
        accommodation: accommodation
      }
    });
    notifications.push({ type: 'web', success: true, data: webNotification });
    
    // 2. Send email notification (if provider email exists)
    if (accommodation.providerEmail || accommodation.ownerEmail) {
      const emailContent = generateEmailContent(type, booking, accommodation);
      const emailResult = await sendEmailNotification(
        accommodation.providerEmail || accommodation.ownerEmail,
        getNotificationTitle(type),
        emailContent
      );
      notifications.push({ type: 'email', ...emailResult });
    }
    
    // 3. You can add more notification types here (SMS, push notifications, etc.)
    
    return {
      success: true,
      notifications: notifications,
      webNotificationId: webNotification.id
    };
    
  } catch (error) {
    console.error('Error sending booking notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send booking status update notification to customer
const sendCustomerNotification = async (booking, type = 'booking_confirmed') => {
  try {
    const notifications = [];
    
    // Send email to customer
    if (booking.customerEmail) {
      const emailContent = generateCustomerEmailContent(type, booking);
      const emailResult = await sendEmailNotification(
        booking.customerEmail,
        getCustomerNotificationTitle(type),
        emailContent
      );
      notifications.push({ type: 'email', ...emailResult });
    }
    
    return {
      success: true,
      notifications: notifications
    };
    
  } catch (error) {
    console.error('Error sending customer notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper functions
const getNotificationTitle = (type) => {
  const titles = {
    'new_booking': '🔔 New Booking Request!',
    'booking_cancelled': '❌ Booking Cancelled',
    'booking_modified': '📝 Booking Modified'
  };
  return titles[type] || 'Booking Notification';
};

const getNotificationMessage = (type, booking, accommodation) => {
  switch (type) {
    case 'new_booking':
      return `New booking request for ${accommodation.name || 'your accommodation'} from ${booking.customerName}. Check-in: ${booking.checkInDate}`;
    case 'booking_cancelled':
      return `Booking for ${accommodation.name || 'your accommodation'} has been cancelled by ${booking.customerName}`;
    case 'booking_modified':
      return `Booking for ${accommodation.name || 'your accommodation'} has been modified by ${booking.customerName}`;
    default:
      return 'You have a new booking notification';
  }
};

const getCustomerNotificationTitle = (type) => {
  const titles = {
    'booking_confirmed': '✅ Booking Confirmed!',
    'booking_rejected': '❌ Booking Rejected',
    'booking_cancelled': '🚫 Booking Cancelled'
  };
  return titles[type] || 'Booking Update';
};

const generateEmailContent = (type, booking, accommodation) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${getNotificationTitle(type)}</h2>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Booking Details:</h3>
        <p><strong>Customer:</strong> ${booking.customerName}</p>
        <p><strong>Email:</strong> ${booking.customerEmail}</p>
        <p><strong>Phone:</strong> ${booking.customerPhone || 'Not provided'}</p>
        <p><strong>Accommodation:</strong> ${accommodation.name || 'N/A'}</p>
        <p><strong>Check-in:</strong> ${booking.checkInDate}</p>
        <p><strong>Check-out:</strong> ${booking.checkOutDate}</p>
        <p><strong>Guests:</strong> ${booking.numberOfGuests || 'Not specified'}</p>
        ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666;">Please log in to your dashboard to manage this booking.</p>
        <a href="http://localhost:3000/provider/dashboard" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Dashboard
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated notification from TravelWish Booking System
      </p>
    </div>
  `;
};

const generateCustomerEmailContent = (type, booking) => {
  const statusMessages = {
    'booking_confirmed': 'Your booking has been confirmed by the service provider!',
    'booking_rejected': 'Unfortunately, your booking request has been rejected.',
    'booking_cancelled': 'Your booking has been cancelled.'
  };
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${getCustomerNotificationTitle(type)}</h2>
      
      <p style="font-size: 16px; color: #555;">${statusMessages[type]}</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Your Booking Details:</h3>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Check-in:</strong> ${booking.checkInDate}</p>
        <p><strong>Check-out:</strong> ${booking.checkOutDate}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        Thank you for using TravelWish!
      </p>
    </div>
  `;
};

module.exports = {
  sendBookingNotification,
  sendCustomerNotification,
  getWebNotifications,
  markNotificationAsRead,
  sendEmailNotification
};
