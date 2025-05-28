const CardDetail = require('../models/cardModel');

const createCardDetail = async (req, res) => {
  try {
    const cardData = req.body;

    // Create new card detail document
    const newCard = new CardDetail({
      ...cardData
    });

    // Save to database
    const savedCard = await newCard.save();

    res.status(201).json({
      success: true,
      data: savedCard
    });
  } catch (error) {
    // Handle duplicate card number
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Card number already exists'
      });
    }

    // Handle other errors
    console.error('Error creating card detail:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { createCardDetail };
