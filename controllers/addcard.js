const CardDetail = require("../models/cardModel"); // Ensure correct path

const createCardDetail = async (req, res) => {
  try {
    // Expecting stripePaymentMethodId, userId, cardHolderName from frontend
    const { userId, stripePaymentMethodId, cardHolderName } = req.body;

    if (!userId || !stripePaymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or stripePaymentMethodId",
      });
    }

    // Check if a card with this PaymentMethod ID already exists for the user
    const existingCard = await CardDetail.findOne({ userId, stripePaymentMethodId });
    if (existingCard) {
      return res.status(409).json({ // 409 Conflict if already exists
        success: false,
        message: "This card (Stripe Payment Method ID) is already saved for this user.",
      });
    }

    // You might want to retrieve additional card details from Stripe here
    // using the Stripe Node.js library if you need more info (e.g., last4, brand)
    // For now, we'll save what's sent from the frontend.

    // Create new card detail document
    const newCard = new CardDetail({
      userId,
      stripePaymentMethodId,
      cardHolderName,
      // You can add cardBrand, cardLastFour, etc., here if extracted from Stripe's response
      // or sent from the frontend.
    });

    // Save to database
    const savedCard = await newCard.save();

    res.status(201).json({
      success: true,
      message: "Card details saved successfully with Stripe Payment Method ID.",
      data: savedCard,
    });
  } catch (error) {
    console.error("Error creating card detail:", error);
    res.status(500).json({
      success: false,
      message: "Server error saving card details.",
      error: error.message,
    });
  }
};

module.exports = { createCardDetail };