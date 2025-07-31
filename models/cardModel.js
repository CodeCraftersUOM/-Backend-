const mongoose = require('mongoose');

const cardDetailSchema = new mongoose.Schema({
  userId: { // Link to your user if you have a user model/system
    type: mongoose.Schema.Types.ObjectId, // Or String, depending on your user ID type
    required: true,
    index: true, // For faster lookup by user
  },
  stripePaymentMethodId: { // This is the ID from Stripe, not the raw card number
    type: String,
    required: true,
    unique: true, // A user might have multiple cards, but each PaymentMethod ID is unique
    trim: true,
  },
  cardHolderName: { // Storing the name is generally fine
    type: String,
    required: false, // Make this true if you want to enforce it
    trim: true,
  },
  // You might want to store some display info directly from Stripe's response:
  cardBrand: {
    type: String,
    required: false,
  },
  cardLastFour: {
    type: String,
    required: false,
  },
  cardExpMonth: {
    type: Number,
    required: false,
  },
  cardExpYear: {
    type: Number,
    required: false,
  },
  // Do NOT store: cardNumber, expiryDate, cvv directly.
}, { timestamps: true });

// Ensure the model name is 'CardDetail' and doesn't conflict
const CardDetail = mongoose.models.CardDetail || mongoose.model('CardDetail', cardDetailSchema);

module.exports = CardDetail;