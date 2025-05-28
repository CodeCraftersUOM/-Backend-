const mongoose = require('mongoose');

const cardDetailSchema = new mongoose.Schema({
  cardHolderName: {
    type: String,
    required: true,
    trim: true,
  },
  cardNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  expiryDate: {
    type: String,
    required: true,
    trim: true,
  },
  cvv: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const CardDetail = mongoose.models.CardDetail || mongoose.model('CardDetail', cardDetailSchema);

module.exports = CardDetail;
