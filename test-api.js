const http = require('http');

const testData = {
  fullNameOrBusinessName: "Test Business",
  ownerName: "John Doe",
  cnicOrNationalId: "1234567890123",
  businessRegistrationNumber: "PV12345",
  primaryPhoneNumber: "0771234567",
  alternatePhoneNumber: "0112345678",
  emailAddress: "test@example.com",
  whatsappNumber: "0771234567",
  websiteUrl: "https://example.com",
  typeOfService: "Cleaning Services",
  listOfServicesOffered: ["House Cleaning", "Office Cleaning"],
  pricingMethod: "Per Hour",
  yearsOfExperience: 5,
  availability: {
    availableDays: ["Monday", "Tuesday", "Wednesday"],
    availableTimeSlots: "9:00 AM - 6:00 PM",
    is24x7Available: false,
    emergencyOrOnCallAvailable: true
  },
  termsAgreed: true
};

function testAPI() {
  console.log('🧪 Testing Other Services API...');
  console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
  
  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'localhost',
    port: 2000,
    path: '/api/other-services',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 201) {
          console.log('✅ Success!');
          console.log('📄 Response:', response);
        } else {
          console.log('❌ Error:');
          console.log('📄 Response:', response);
        }
      } catch (e) {
        console.log('❌ Error parsing response:', e);
        console.log('📄 Raw response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Network error:', error.message);
  });
  
  req.write(postData);
  req.end();
}

// Test the GET endpoint to see existing data
function testGetAPI() {
  console.log('\n📥 Testing GET endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 2000,
    path: '/api/other-services',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📄 Response:', response);
        if (response.data && response.data.length > 0) {
          console.log(`📊 Found ${response.data.length} services in database`);
        } else {
          console.log('📊 No services found in database');
        }
      } catch (e) {
        console.log('❌ Error parsing response:', e);
        console.log('📄 Raw response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Network error:', error.message);
  });
  
  req.end();
}

// Run tests
testAPI();
setTimeout(testGetAPI, 2000); // Wait 2 seconds then test GET 