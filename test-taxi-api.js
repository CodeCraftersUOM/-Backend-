const axios = require('axios');

const testTaxiRegistration = async () => {
  try {
    const testData = {
      fullName: "Test Driver",
      drivingLicenseCardNumber: "B1234567",
      contactNumber: "0771234567",
      emailAddress: "test@example.com",
      alternatePhone: "0112345678",
      drivingLicenseNumber: "DL12345678",
      licenseExpiryDate: "2025-12-31",
      yearsOfExperience: "5",
      vehicleMakeModel: "Toyota Corolla",
      vehicleType: "Sedan",
      vehicleRegistrationNumber: "ABC-1234",
      seatingCapacity: "4",
      hasAirConditioning: true,
      hasLuggageSpace: false,
      serviceCity: "Colombo",
      availableDays: ["Monday", "Tuesday", "Wednesday"],
      availableTimeSlot: "9:00 AM - 6:00 PM",
      is24x7Available: false
    };

    console.log('Testing taxi registration...');
    const response = await axios.post('http://localhost:2000/api/addTaxiDriver', testData);
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testTaxiRegistration(); 