const CommonService = require('../models/otherModel');

// Create a new common service
const createCommonService = async (req, res) => {
  try {
    const serviceData = req.body;
    const newService = new CommonService(serviceData);
    const savedService = await newService.save();
    res.status(201).json({
      success: true,
      data: savedService,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ success: false, error: `${field} already exists` });
    }
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all common services
const getAllCommonServices = async (req, res) => {
    try {
        const services = await CommonService.find({});
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Get a single common service by ID
const getCommonServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await CommonService.findById(id);
        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        console.error('Error fetching service by ID:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Update a common service
const updateCommonService = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedService = await CommonService.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedService) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        res.status(200).json({ success: true, data: updatedService });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Delete a common service
const deleteCommonService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await CommonService.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        res.status(200).json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Search for common services
const searchCommonServices = async (req, res) => {
    try {
        const { query, serviceType, pricingMethod } = req.body;
        let filter = {};

        if (query) {
            filter.$or = [
                { fullNameOrBusinessName: { $regex: query, $options: "i" } },
                { typeOfService: { $regex: query, $options: "i" } },
                { listOfServicesOffered: { $in: [new RegExp(query, 'i')] } }
            ];
        }
        if (serviceType) {
            filter.typeOfService = { $regex: serviceType, $options: "i" };
        }
        if (pricingMethod) {
            filter.pricingMethod = pricingMethod;
        }

        const services = await CommonService.find(filter);
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error("Error searching services:", error);
        res.status(500).json({ success: false, error: "Server error during search" });
    }
};

module.exports = { 
    createCommonService,
    getAllCommonServices,
    getCommonServiceById,
    updateCommonService,
    deleteCommonService,
    searchCommonServices
};
