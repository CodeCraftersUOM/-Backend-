const mongoose = require('mongoose');
const CommonService = require('./models/otherModel');

const uri = "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/service-provider?retryWrites=true&w=majority&appName=Cluster0";

async function testDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully');
    
    // Check if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Test creating a service
    console.log('\n🧪 Testing service creation...');
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
    
    console.log('📝 Service object created');
    console.log('📊 Service data:', testService);
    
    // Save the service
    const savedService = await testService.save();
    console.log('💾 Service saved with ID:', savedService._id);
    
    // Fetch all services
    console.log('\n📥 Fetching all services...');
    const allServices = await CommonService.find({});
    console.log(`📊 Found ${allServices.length} services in database`);
    
    if (allServices.length > 0) {
      console.log('📋 Services in database:');
      allServices.forEach((service, index) => {
        console.log(`${index + 1}. ${service.fullNameOrBusinessName} - ${service.typeOfService}`);
      });
    }
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await CommonService.deleteOne({ _id: savedService._id });
    console.log('✅ Test data cleaned up');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'ValidationError') {
      console.error('📝 Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  ${key}: ${error.errors[key].message}`);
      });
    }
    if (error.name === 'MongoError') {
      console.error('🗄️ MongoDB error:', error.message);
    }
  }
}

testDatabase(); 