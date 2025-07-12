const CommunicationService = require('../models/communicationModel');

// Create a new communication service
const createCommunicationService = async (req, res) => {
  try {
    const serviceData = req.body;
    
    // Check if communication service with same email or business registration already exists
    const existingService = await CommunicationService.findOne({
      $or: [
        { emailAddress: serviceData.emailAddress },
        { businessRegistration: serviceData.businessRegistration }
      ]
    });
    
    if (existingService) {
      const duplicateField = existingService.emailAddress === serviceData.emailAddress ? 'email' : 'business registration';
      return res.status(409).json({
        success: false,
        message: `Communication service with this ${duplicateField} already exists`,
        duplicateField: duplicateField
      });
    }
    
    // Create new communication service document
    const newService = new CommunicationService(serviceData);
    
    // Save to database
    const savedService = await newService.save();
    
    res.status(201).json({
      success: true,
      message: 'Communication service created successfully',
      data: savedService,
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
    
    // Handle other errors
    console.error('Error creating communication service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update communication service
const updateCommunicationService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if service exists
    const existingService = await CommunicationService.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Communication service not found'
      });
    }
    
    // Check for duplicate email or business registration if they're being updated
    if (updateData.emailAddress || updateData.businessRegistration) {
      const duplicateQuery = {
        _id: { $ne: id }, // Exclude current service
        $or: []
      };
      
      if (updateData.emailAddress) {
        duplicateQuery.$or.push({ emailAddress: updateData.emailAddress });
      }
      if (updateData.businessRegistration) {
        duplicateQuery.$or.push({ businessRegistration: updateData.businessRegistration });
      }
      
      const duplicateService = await CommunicationService.findOne(duplicateQuery);
      if (duplicateService) {
        const duplicateField = duplicateService.emailAddress === updateData.emailAddress ? 'email' : 'business registration';
        return res.status(409).json({
          success: false,
          message: `Communication service with this ${duplicateField} already exists`,
          duplicateField: duplicateField
        });
      }
    }
    
    // Update service
    const updatedService = await CommunicationService.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Communication service updated successfully',
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
    
    console.error('Error updating communication service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single communication service
const getCommunicationService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await CommunicationService.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Communication service not found'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching communication service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all communication services
const getAllCommunicationServices = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      serviceType, 
      paymentMethod, 
      coverageArea
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (serviceType) {
      filter.serviceTypesOffered = { $in: [serviceType] };
    }
    
    if (paymentMethod) {
      filter.paymentMethods = { $in: [paymentMethod] };
    }
    
    if (coverageArea) {
      filter.serviceCoverageArea = { $in: [coverageArea] };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch services with filters and pagination
    const services = await CommunicationService.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await CommunicationService.countDocuments(filter);
    
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
    console.error('Error fetching communication services:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete communication service
const deleteCommunicationService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedService = await CommunicationService.findByIdAndDelete(id);
    
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Communication service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Communication service deleted successfully',
      data: deletedService
    });
  } catch (error) {
    console.error('Error deleting communication service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createCommunicationService,
  updateCommunicationService,
  getCommunicationService,
  getAllCommunicationServices,
  deleteCommunicationService
};