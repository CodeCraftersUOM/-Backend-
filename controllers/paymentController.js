const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CardDetail = require('../models/cardModel');
const User = require('../models/userModel');

// Helper function to get or create Stripe customer
async function getOrCreateStripeCustomer(user) {
  try {
    // Check if user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      try {
        return await stripe.customers.retrieve(user.stripeCustomerId);
      } catch (error) {
        console.log('Stripe customer not found, creating new one');
      }
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName,
      metadata: {
        userId: user._id.toString()
      }
    });

    // Save customer ID to user
    await User.findByIdAndUpdate(user._id, {
      stripeCustomerId: customer.id
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

// Create Payment Intent for new card
const createPaymentIntent = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { amount, currency = 'lkr', saveCard = false } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        saveCard: saveCard.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Process payment with saved card
const processPaymentWithSavedCard = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { cardId, amount, currency = 'lkr' } = req.body;

    console.log('🔍 processPaymentWithSavedCard called:', { cardId, amount, userId: req.user._id });

    // Validate inputs
    if (!cardId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Card ID and valid amount are required'
      });
    }

    // Find the saved card
    const savedCard = await CardDetail.findOne({
      _id: cardId,
      userId: req.user._id,
      isActive: true
    });

    if (!savedCard) {
      return res.status(404).json({
        success: false,
        message: 'Saved card not found'
      });
    }

    console.log('💳 Found saved card:', {
      id: savedCard._id,
      hasStripePaymentMethodId: !!savedCard.stripePaymentMethodId,
      hasStripeCustomerId: !!savedCard.stripeCustomerId,
      cardNumber: savedCard.cardNumber
    });

    // Check if card has Stripe payment method ID
    if (!savedCard.stripePaymentMethodId) {
      console.log('⚠️ Card missing stripePaymentMethodId - this card was saved via old method');
      
      // For cards saved via the old method, return a helpful error with guidance
      return res.status(400).json({
        success: false,
        message: 'This card was saved using an older method and cannot be used for payments. Please add a new card and make sure to check "Save card" during payment.',
        errorCode: 'OLD_CARD_FORMAT',
        recommendation: 'Please add a new card through the payment process with "Save card" checked'
      });
    }

    // Ensure user has a Stripe customer ID
    if (!req.user.stripeCustomerId) {
      console.log('⚠️ User missing stripeCustomerId');
      return res.status(400).json({
        success: false,
        message: 'Customer not configured for payments. Please re-save the card.',
        errorCode: 'MISSING_CUSTOMER_ID'
      });
    }

    try {
      console.log('🔍 Verifying payment method with Stripe...');
      
      // Verify the payment method is still valid and attached to customer
      const paymentMethod = await stripe.paymentMethods.retrieve(savedCard.stripePaymentMethodId);
      
      console.log('💳 Payment method status:', {
        id: paymentMethod.id,
        customer: paymentMethod.customer,
        userCustomerId: req.user.stripeCustomerId
      });
      
      // Check if payment method is attached to the customer
      if (!paymentMethod.customer || paymentMethod.customer !== req.user.stripeCustomerId) {
        console.log(`🔗 Re-attaching payment method ${savedCard.stripePaymentMethodId} to customer ${req.user.stripeCustomerId}`);
        
        // Re-attach payment method to customer
        await stripe.paymentMethods.attach(savedCard.stripePaymentMethodId, {
          customer: req.user.stripeCustomerId,
        });
        
        console.log('✅ Payment method re-attached successfully');
      }

      console.log('💳 Creating payment intent with saved payment method...');
      
      // Create payment intent with the saved payment method
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        payment_method: savedCard.stripePaymentMethodId,
        customer: req.user.stripeCustomerId,
        confirmation_method: 'manual',
        confirm: true,
        metadata: {
          userId: req.user._id.toString(),
          userEmail: req.user.email,
          cardId: cardId,
          savedCardUsed: 'true'
        }
      });

      console.log('💳 Payment intent created:', {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100
      });

      // Handle the payment result
      if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
        console.log('🔐 Payment requires additional authentication');
        return res.json({
          success: true,
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: amount,
          currency: currency,
          cardInfo: {
            id: savedCard._id,
            cardHolderName: savedCard.cardHolderName,
            expiryDate: savedCard.expiryDate
          }
        });
      } else if (paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded immediately');
        return res.json({
          success: true,
          message: 'Payment successful with saved card',
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency
          },
          cardInfo: {
            id: savedCard._id,
            cardHolderName: savedCard.cardHolderName,
            cardNumber: savedCard.cardNumber,
            expiryDate: savedCard.expiryDate
          }
        });
      } else {
        console.log('❌ Payment failed with status:', paymentIntent.status);
        return res.status(400).json({
          success: false,
          message: 'Payment failed',
          status: paymentIntent.status
        });
      }

    } catch (stripeError) {
      console.error('❌ Stripe error processing saved card payment:', stripeError);
      
      // Handle specific Stripe errors
      if (stripeError.type === 'StripeCardError') {
        return res.status(400).json({
          success: false,
          message: 'Card error: ' + stripeError.message,
          errorCode: 'STRIPE_CARD_ERROR'
        });
      }
      
      if (stripeError.message && stripeError.message.includes('does not exist')) {
        return res.status(400).json({
          success: false,
          message: 'This saved card is no longer valid. Please add a new card.',
          errorCode: 'PAYMENT_METHOD_NOT_FOUND',
          recommendation: 'Please add a new card'
        });
      }
      
      if (stripeError.message && stripeError.message.includes('not attached to customer')) {
        return res.status(400).json({
          success: false,
          message: 'Card configuration issue. Please re-save the card.',
          errorCode: 'PAYMENT_METHOD_NOT_ATTACHED',
          recommendation: 'Please add a new card'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Payment processing failed',
        error: process.env.NODE_ENV === 'development' ? stripeError.message : 'Payment processing error',
        errorCode: 'STRIPE_ERROR'
      });
    }

  } catch (error) {
    console.error('❌ Error processing payment with saved card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      errorCode: 'INTERNAL_ERROR'
    });
  }
};

// Confirm payment and save card if requested
const confirmPayment = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { paymentIntentId, paymentMethodId, saveCard, cardDetails } = req.body;
    
    // Enhanced logging for debugging
    console.log('🔍 confirmPayment called with data:', {
      paymentIntentId,
      paymentMethodId,
      saveCard,
      cardDetails,
      userId: req.user._id
    });

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID is required'
      });
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('💳 Payment intent status:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful
      let savedCardInfo = null;

      // Save card if requested and card details provided
      if (saveCard && paymentMethodId && cardDetails) {
        console.log('💾 Starting card save process...');
        try {
          // Get or create Stripe customer
          const customer = await getOrCreateStripeCustomer(req.user);
          console.log('👤 Stripe customer:', customer.id);
          
          // Attach payment method to customer FIRST
          console.log('🔗 Attaching payment method to customer...');
          await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customer.id,
          });

          // Retrieve payment method details from Stripe
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
          console.log('💳 Payment method details:', {
            id: paymentMethod.id,
            type: paymentMethod.type,
            card: paymentMethod.card ? {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              exp_month: paymentMethod.card.exp_month,
              exp_year: paymentMethod.card.exp_year
            } : null
          });
          
          if (paymentMethod.card) {
            // Check if card already exists to prevent duplicates
            const existingCard = await CardDetail.findOne({
              userId: req.user._id,
              stripePaymentMethodId: paymentMethodId
            });

            if (!existingCard) {
              // Create encrypted card record in our database
              const cardData = {
                userId: req.user._id,
                cardHolderName: cardDetails.cardHolderName || 'Card Holder',
                cardNumber: `****-****-****-${paymentMethod.card.last4}`, // Store masked version
                expiryDate: `${String(paymentMethod.card.exp_month).padStart(2, '0')}/${String(paymentMethod.card.exp_year).slice(-2)}`,
                cvv: '***', // Never store real CVV
                stripePaymentMethodId: paymentMethodId, // Store Stripe's payment method ID
                stripeCustomerId: customer.id, // Store customer ID
                isActive: true
              };

              console.log('💾 Saving card data to database:', cardData);
              const newCard = new CardDetail(cardData);
              savedCardInfo = await newCard.save();
              
              console.log(`✅ Card saved successfully with ID: ${savedCardInfo._id}`);
            } else {
              savedCardInfo = existingCard;
              console.log(`ℹ️ Card already exists with ID: ${existingCard._id}`);
            }
          }
        } catch (cardSaveError) {
          console.error('❌ Error saving card after payment:', cardSaveError);
          // Don't fail the payment confirmation if card saving fails
        }
      } else {
        console.log('⏭️ Skipping card save - conditions not met:', {
          saveCard,
          hasPaymentMethodId: !!paymentMethodId,
          hasCardDetails: !!cardDetails
        });
      }

      console.log('📤 Sending response with savedCard:', savedCardInfo ? savedCardInfo._id : 'none');

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        },
        savedCard: savedCardInfo ? {
          id: savedCardInfo._id,
          cardHolderName: savedCardInfo.cardHolderName,
          cardNumber: savedCardInfo.cardNumber,
          expiryDate: savedCardInfo.expiryDate
        } : null
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get payment history for user
const getPaymentHistory = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get payments from Stripe
    const payments = await stripe.paymentIntents.list({
      limit: 10,
      metadata: {
        userId: req.user._id.toString()
      }
    });

    const formattedPayments = payments.data.map(payment => ({
      id: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      created: new Date(payment.created * 1000),
      description: payment.description || 'Travel booking payment'
    }));

    res.status(200).json({
      success: true,
      payments: formattedPayments,
      hasMore: payments.has_more
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createPaymentIntent,
  processPaymentWithSavedCard,
  confirmPayment,
  getPaymentHistory
};
