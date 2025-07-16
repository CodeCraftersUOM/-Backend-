const HealthService = require('../models/healthModel');

// Create a new health service
const createHealthService = async (req, res) => {
  try {
    const healthData = req.body;
    
    // Check if health service with same email or registration number already exists
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
    
    // Create new health service document
    const newHealthService = new HealthService(healthData);
    
    // Save to MongoDB
    const savedHealthService = await newHealthService.save();
    
    res.status(201).json({
      success: true,
      message: 'Health service created successfully',
      data: savedHealthService,
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        duplicateField: field
      });
    }
    
    // Handle other server or validation errors
    console.error('Error creating health service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update health service
const updateHealthService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if health service exists
    const existingService = await HealthService.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Health service not found'
      });
    }
    
    // Check for duplicate email or registration number if they're being updated
    if (updateData.contactEmail || updateData.registrationNumber) {
      const duplicateQuery = {
        _id: { $ne: id }, // Exclude current service
        $or: []
      };
      
      if (updateData.contactEmail) {
        duplicateQuery.$or.push({ contactEmail: updateData.contactEmail });
      }
      if (updateData.registrationNumber) {
        duplicateQuery.$or.push({ registrationNumber: updateData.registrationNumber });
      }
      
      const duplicateService = await HealthService.findOne(duplicateQuery);
      if (duplicateService) {
        const duplicateField = duplicateService.contactEmail === updateData.contactEmail ? 'email' : 'registration number';
        return res.status(409).json({
          success: false,
          message: `Health service with this ${duplicateField} already exists`,
          duplicateField: duplicateField
        });
      }
    }
    
    // Update health service
    const updatedService = await HealthService.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Health service updated successfully',
      data: updatedService
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        duplicateField: field
      });
    }
    
    console.error('Error updating health service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single health service
const getHealthService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await HealthService.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Health service not found'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching health service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all health services
const getAllHealthServices = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      serviceType, 
      specialty,
      emergencyAvailable,
      onCallAvailable,
      facilityName,
      minYears,
      maxYears
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (serviceType) {
      filter.serviceType = serviceType;
    }
    
    if (specialty) {
      filter.specialties = { $in: [specialty] };
    }
    
    if (emergencyAvailable !== undefined) {
      filter['workingHours.emergencyAvailable'] = emergencyAvailable === 'true';
    }
    
    if (onCallAvailable !== undefined) {
      filter['workingHours.onCallAvailable'] = onCallAvailable === 'true';
    }
    
    if (facilityName) {
      filter.facilityName = { $regex: facilityName, $options: 'i' };
    }
    
    if (minYears || maxYears) {
      filter.yearsInOperation = {};
      if (minYears) filter.yearsInOperation.$gte = parseInt(minYears);
      if (maxYears) filter.yearsInOperation.$lte = parseInt(maxYears);
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch health services with filters and pagination
    const services = await HealthService.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await HealthService.countDocuments(filter);
    
    res.json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalServices: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching health services:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete health service
const deleteHealthService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedService = await HealthService.findByIdAndDelete(id);
    
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Health service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Health service deleted successfully',
      data: deletedService
    });
  } catch (error) {
    console.error('Error deleting health service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get health services by specialty
const getHealthServicesBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const filter = { specialties: { $in: [specialty] } };
    const skip = (page - 1) * limit;
    
    const services = await HealthService.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await HealthService.countDocuments(filter);
    
    res.json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalServices: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching health services by specialty:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get emergency services
const getEmergencyServices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const filter = { 'workingHours.emergencyAvailable': true };
    const skip = (page - 1) * limit;
    
    const services = await HealthService.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await HealthService.countDocuments(filter);
    
    res.json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalServices: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching emergency services:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createHealthService,
  updateHealthService,
  getHealthService,
  getAllHealthServices,
  deleteHealthService,
  getHealthServicesBySpecialty,
  getEmergencyServices
};