const mongoose = require('mongoose');
const CommonService = require('./models/otherModel');

const uri = "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/service-provider?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully');
    
    // Test the model
    console.log('Testing CommonService model...');
    const testService = new CommonService({
      fullNameOrBusinessName: "Test Business",
      primaryPhoneNumber: "0771234567",
      emailAddress: "test@example.com",
      typeOfService: "Cleaning Services",
      listOfServicesOffered: ["House Cleaning"],
      pricingMethod: "Per Hour",
      availability: {
        availableDays: ["Monday"],
        availableTimeSlots: "9:00 AM - 6:00 PM"
      },
      termsAgreed: true
    });
    
    console.log('✅ Model created successfully');
    console.log('Model schema:', testService.schema.obj);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
  }
}

testConnection();
