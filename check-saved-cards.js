// Database connection and card checking utility
require('dotenv').config();
const mongoose = require('mongoose');
const CardDetail = require('./models/cardModel');
const User = require('./models/userModel');

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://nimesh:1234@cluster0.kbpfn.mongodb.net/TravelWish?retryWrites=true&w=majority&appName=Cluster0';
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Check saved cards status
const checkSavedCards = async () => {
  try {
    console.log('\n🔍 Checking saved cards in database...\n');
    
    // Get all cards
    const allCards = await CardDetail.find({}).populate('userId', 'email fullName stripeCustomerId');
    
    console.log(`📋 Total cards found: ${allCards.length}\n`);
    
    if (allCards.length === 0) {
      console.log('No cards found in database.\n');
      return;
    }
    
    let cardsWithStripeMethod = 0;
    let cardsWithoutStripeMethod = 0;
    let usersWithStripeCustomer = 0;
    let usersWithoutStripeCustomer = 0;
    
    console.log('📊 Card Analysis:');
    console.log('='.repeat(80));
    
    for (const card of allCards) {
      const hasStripeMethod = !!card.stripePaymentMethodId;
      const hasStripeCustomer = !!card.userId?.stripeCustomerId;
      
      if (hasStripeMethod) cardsWithStripeMethod++;
      else cardsWithoutStripeMethod++;
      
      if (hasStripeCustomer) usersWithStripeCustomer++;
      else usersWithoutStripeCustomer++;
      
      console.log(`
💳 Card ID: ${card._id}
   └── User: ${card.userId?.email || 'Unknown'}
   └── Card Number: ${card.cardNumber}
   └── Holder: ${card.cardHolderName}
   └── Expiry: ${card.expiryDate}
   └── Has Stripe Payment Method: ${hasStripeMethod ? '✅' : '❌'} ${hasStripeMethod ? `(${card.stripePaymentMethodId})` : ''}
   └── User Has Stripe Customer: ${hasStripeCustomer ? '✅' : '❌'} ${hasStripeCustomer ? `(${card.userId?.stripeCustomerId})` : ''}
   └── Can Process Payments: ${hasStripeMethod && hasStripeCustomer ? '✅ YES' : '❌ NO'}
      `);
    }
    
    console.log('='.repeat(80));
    console.log('\n📈 Summary:');
    console.log(`Cards with Stripe Payment Method: ${cardsWithStripeMethod}/${allCards.length}`);
    console.log(`Cards without Stripe Payment Method: ${cardsWithoutStripeMethod}/${allCards.length}`);
    console.log(`Users with Stripe Customer ID: ${usersWithStripeCustomer}/${allCards.length}`);
    console.log(`Users without Stripe Customer ID: ${usersWithoutStripeCustomer}/${allCards.length}`);
    
    if (cardsWithoutStripeMethod > 0) {
      console.log('\n⚠️  ISSUE IDENTIFIED:');
      console.log(`${cardsWithoutStripeMethod} card(s) were saved using the old method (via /api/cards endpoint)`);
      console.log('These cards cannot be used for payments and will show the error:');
      console.log('"Card is not configured for payments. Please re-save the card."');
      console.log('\n🔧 SOLUTION:');
      console.log('Users need to add new cards through the payment process with "Save card" checked.');
      console.log('Cards saved during payment confirmation will have proper Stripe integration.');
    }
    
    if (cardsWithStripeMethod > 0) {
      console.log('\n✅ GOOD NEWS:');
      console.log(`${cardsWithStripeMethod} card(s) were saved properly with Stripe integration.`);
      console.log('These cards should work for payments.');
    }
    
  } catch (error) {
    console.error('❌ Error checking cards:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await checkSavedCards();
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed.');
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkSavedCards };
