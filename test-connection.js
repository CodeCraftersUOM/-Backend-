const mongoose = require('mongoose');

const testConnection = async () => {
  const uri = "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/TravelWish";
  
  try {
    console.log('🔄 Testing MongoDB connection...');
    await mongoose.connect(uri);
    console.log('✅ MongoDB connection successful!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas cluster is running');
    console.log('3. Check IP whitelist (add 0.0.0.0/0 for testing)');
    console.log('4. Verify username/password in connection string');
  }
  
  process.exit(0);
};

testConnection();
