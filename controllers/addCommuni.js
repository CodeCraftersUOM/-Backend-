const CommunicationService = require('../models/communicationModel');

// Create a new communication service (with original error handling)
const createCommunicationService = async (req, res) => {
  try {
    const serviceData = req.body;
    
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
    
    const newService = new CommunicationService(serviceData);
    const savedService = await newService.save();
    
    res.status(201).json({
      success: true,
      message: 'Communication service created successfully',
      data: savedService,
    });
  } catch (error) {
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
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        duplicateField: field
      });
    }
    
    console.error('Error creating communication service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update communication service (with original error handling)
const updateCommunicationService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingService = await CommunicationService.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Communication service not found'
      });
    }
    
    if (updateData.emailAddress || updateData.businessRegistration) {
      const duplicateQuery = {
        _id: { $ne: id },
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

// Get single communication service (Original function)
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

// Get all communication services (MODIFIED to remove pagination)
const getAllCommunicationServices = async (req, res) => {
  try {
    const services = await CommunicationService.find({}).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching communication services:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete communication service (Original function)
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

// NEW: Search and filter communication services (using POST)
const searchCommunicationServices = async (req, res) => {
    try {
        const { query, serviceType, paymentMethod, coverageArea } = req.body;
        let filter = {};

        if (query) {
            filter.$or = [
                { companyName: { $regex: query, $options: "i" } },
                { specialFeatures: { $regex: query, $options: "i" } },
            ];
        }
        if (serviceType) {
            filter.serviceTypesOffered = { $in: [serviceType] };
        }
        if (paymentMethod) {
            filter.paymentMethods = { $in: [paymentMethod] };
        }
        if (coverageArea) {
            filter.serviceCoverageArea = { $in: [coverageArea] };
        }

        const services = await CommunicationService.find(filter);
        res.status(200).json({ success: true, data: services });

    } catch (error) {
        console.error("Error searching communication services:", error);
        res.status(500).json({ success: false, error: "Server error during search" });
    }
};

module.exports = {
  createCommunicationService,
  updateCommunicationService,
  getCommunicationService,
  getAllCommunicationServices,
  deleteCommunicationService,
  searchCommunicationServices, // ADDED new function to exports
};
