const HealthService = require('../models/healthModel');

// Create a new health service (Original function preserved)
const createHealthService = async (req, res) => {
  try {
    const healthData = req.body;
    
    const existingService = await HealthService.findOne({
      $or: [
        { contactEmail: healthData.contactEmail },
        ...(healthData.registrationNumber ? [{ registrationNumber: healthData.registrationNumber }] : [])
      ]
    });
    
    if (existingService) {
      const duplicateField = existingService.contactEmail === healthData.contactEmail ? 'email' : 'registration number';
      return res.status(409).json({
        success: false,
        message: `Health service with this ${duplicateField} already exists`,
        duplicateField: duplicateField
      });
    }
    
    const newHealthService = new HealthService(healthData);
    const savedHealthService = await newHealthService.save();
    
    res.status(201).json({
      success: true,
      message: 'Health service created successfully',
      data: savedHealthService,
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
    console.error('Error creating health service:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// Update health service (Original function preserved)
const updateHealthService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingService = await HealthService.findById(id);
    if (!existingService) {
      return res.status(404).json({ success: false, message: 'Health service not found' });
    }
    
    if (updateData.contactEmail || updateData.registrationNumber) {
      const duplicateQuery = { _id: { $ne: id }, $or: [] };
      if (updateData.contactEmail) duplicateQuery.$or.push({ contactEmail: updateData.contactEmail });
      if (updateData.registrationNumber) duplicateQuery.$or.push({ registrationNumber: updateData.registrationNumber });
      
      const duplicateService = await HealthService.findOne(duplicateQuery);
      if (duplicateService) {
        const duplicateField = duplicateService.contactEmail === updateData.contactEmail ? 'email' : 'registration number';
        return res.status(409).json({ success: false, message: `Health service with this ${duplicateField} already exists`, duplicateField: duplicateField });
      }
    }
    
    const updatedService = await HealthService.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Health service updated successfully', data: updatedService });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message, value: err.value }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors: validationErrors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `${field} already exists`, duplicateField: field });
    }
    console.error('Error updating health service:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// Get single health service (Original function preserved)
const getHealthService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await HealthService.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Health service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching health service:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all health services (MODIFIED to remove pagination)
const getAllHealthServices = async (req, res) => {
  try {
    const services = await HealthService.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching health services:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete health service (Original function preserved)
const deleteHealthService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await HealthService.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ success: false, message: 'Health service not found' });
    }
    res.json({ success: true, message: 'Health service deleted successfully', data: deletedService });
  } catch (error) {
    console.error('Error deleting health service:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// NEW: Search function added to match accommodation feature
const searchHealthServices = async (req, res) => {
    try {
        const { query, serviceType, specialty, emergencyAvailable } = req.body;
        let filter = {};

        if (query) {
            filter.$or = [
                { facilityName: { $regex: query, $options: "i" } },
                { 'doctors.fullName': { $regex: query, $options: "i" } },
                { 'doctors.specialty': { $regex: query, $options: "i" } },
            ];
        }
        if (serviceType) {
            filter.serviceType = serviceType;
        }
        if (specialty) {
            filter.specialties = { $in: [specialty] };
        }
        if (emergencyAvailable !== undefined) {
            filter['workingHours.emergencyAvailable'] = emergencyAvailable === true;
        }

        const services = await HealthService.find(filter);
        res.status(200).json({ success: true, data: services });

    } catch (error) {
        console.error("Error searching health services:", error);
        res.status(500).json({ success: false, error: "Server error during search" });
    }
};

// Original functions getHealthServicesBySpecialty and getEmergencyServices are kept for any other potential use
const getHealthServicesBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;
    const services = await HealthService.find({ specialties: { $in: [specialty] } });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching health services by specialty:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getEmergencyServices = async (req, res) => {
  try {
    const services = await HealthService.find({ 'workingHours.emergencyAvailable': true });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching emergency services:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createHealthService,
  updateHealthService,
  getHealthService,
  getAllHealthServices,
  deleteHealthService,
  getHealthServicesBySpecialty,
  getEmergencyServices,
  searchHealthServices // Added new search function
};
