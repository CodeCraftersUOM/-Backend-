const Doctor = require('../models/healthModel');

// Create a new doctor registration
const createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;
    
    // Check for duplicate email or license number
    const existingDoctor = await Doctor.findOne({
      $or: [
        { email: doctorData.email },
        { licenseNumber: doctorData.licenseNumber }
      ]
    });
    
    if (existingDoctor) {
      const duplicateField = existingDoctor.email === doctorData.email ? 'email' : 'license number';
      return res.status(409).json({
        success: false,
        message: `Doctor with this ${duplicateField} already exists`,
        duplicateField: duplicateField
      });
    }
    
    const newDoctor = new Doctor(doctorData);
    const savedDoctor = await newDoctor.save();
    
    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: savedDoctor,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors: validationErrors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `${field} already exists`, duplicateField: field });
    }
    console.error('Error creating doctor:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingDoctor = await Doctor.findById(id);
    if (!existingDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    if (updateData.email || updateData.licenseNumber) {
      const duplicateQuery = { _id: { $ne: id }, $or: [] };
      if (updateData.email) duplicateQuery.$or.push({ email: updateData.email });
      if (updateData.licenseNumber) duplicateQuery.$or.push({ licenseNumber: updateData.licenseNumber });
      
      const duplicateDoctor = await Doctor.findOne(duplicateQuery);
      if (duplicateDoctor) {
        const duplicateField = duplicateDoctor.email === updateData.email ? 'email' : 'license number';
        return res.status(409).json({ success: false, message: `Doctor with this ${duplicateField} already exists`, duplicateField: duplicateField });
      }
    }
    
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Doctor updated successfully', data: updatedDoctor });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message, value: err.value }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors: validationErrors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `${field} already exists`, duplicateField: field });
    }
    console.error('Error updating doctor:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// Get single doctor
const getDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, message: 'Doctor deleted successfully', data: deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Search doctors
const searchDoctors = async (req, res) => {
    try {
        const { query, specialty, state, city } = req.body;
        let filter = {};

        if (query) {
            filter.$or = [
                { fullName: { $regex: query, $options: "i" } },
                { specialty: { $regex: query, $options: "i" } },
                { medicalSchool: { $regex: query, $options: "i" } },
            ];
        }
        if (specialty) {
            filter.specialty = specialty;
        }
        if (state) {
            filter.state = state;
        }
        if (city) {
            filter.city = { $regex: city, $options: "i" };
        }

        const doctors = await Doctor.find(filter);
        res.status(200).json({ success: true, data: doctors });

    } catch (error) {
        console.error("Error searching doctors:", error);
        res.status(500).json({ success: false, error: "Server error during search" });
    }
};

// Get doctors by specialty
const getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;
    const doctors = await Doctor.find({ specialty: specialty });
    res.json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get doctors by location
const getDoctorsByLocation = async (req, res) => {
  try {
    const { state, city } = req.params;
    let filter = {};
    if (state) filter.state = state;
    if (city) filter.city = { $regex: city, $options: "i" };
    
    const doctors = await Doctor.find(filter);
    res.json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error fetching doctors by location:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createDoctor,
  updateDoctor,
  getDoctor,
  getAllDoctors,
  deleteDoctor,
  getDoctorsBySpecialty,
  getDoctorsByLocation,
  searchDoctors
};
