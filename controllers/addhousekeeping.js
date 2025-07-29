const HousekeepingLaundryService = require('../models/housekeepingModel');

// Create new housekeeping service
const createHousekeepingLaundryService = async (req, res) => {
  try {
    const serviceData = req.body;
    
    // Transform flat data structure to nested structure expected by model
    const transformedData = {
      businessName: serviceData.businessName,
      ownerFullName: serviceData.ownerFullName,
      contactPhone: serviceData.contactPhone,
      contactEmail: serviceData.contactEmail,
      alternatePhone: serviceData.alternatePhone,
      websiteUrl: serviceData.websiteUrl,
      businessDescription: serviceData.businessDescription,
      serviceTypes: serviceData.serviceTypes,
      pricingMethod: serviceData.pricingMethod,
      serviceArea: serviceData.serviceArea,
      addressOrLandmark: serviceData.addressOrLandmark,
      googleMapsLink: serviceData.googleMapsLink,
      availability: {
        daysAvailable: serviceData.daysAvailable,
        timeSlot: serviceData.timeSlot,
        emergencyServiceAvailable: serviceData.emergencyServiceAvailable
      },
      businessRegistrationNumber: serviceData.businessRegistrationNumber,
      licensesCertificates: serviceData.licensesCertificates ? [serviceData.licensesCertificates] : [],
      termsAgreed: serviceData.termsAgreed
    };

    const newService = new HousekeepingLaundryService(transformedData);
    const savedService = await newService.save();
    res.status(201).json({ success: true, data: savedService });
  } catch (error) {
    console.error('Error creating housekeeping/laundry service:', error);
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, error: 'Validation Failed', details: errors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, error: `${field} already exists` });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all housekeeping services (REMOVED pagination to match accommodation)
const getHousekeepingServices = async (req, res) => {
  try {
    const services = await HousekeepingLaundryService.find({ status: 'active' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching housekeeping services:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get a single housekeeping service by its ID
const getHousekeepingServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await HousekeepingLaundryService.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Housekeeping service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching housekeeping service by ID:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Search and filter housekeeping services (CHANGED to use req.body)
const searchHousekeepingServices = async (req, res) => {
  try {
    const {
      query,
      minPrice,
      maxPrice,
      minRating,
      serviceArea,
      serviceType,
      pricingMethod,
    } = req.body; // CHANGED from req.query to req.body

    let filter = { status: 'active' };

    if (query) {
      filter.$or = [
        { businessName: { $regex: query, $options: 'i' } },
        { businessDescription: { $regex: query, $options: 'i' } },
      ];
    }
    if (serviceArea) {
      filter.serviceArea = { $regex: serviceArea, $options: 'i' };
    }
    if (serviceType) {
      filter.serviceTypes = { $in: [serviceType] };
    }
    if (pricingMethod) {
      filter.pricingMethod = pricingMethod;
    }
    if (minPrice != null || maxPrice != null) {
      filter['pricing.hourlyRate'] = {};
      if (minPrice != null) filter['pricing.hourlyRate'].$gte = minPrice;
      if (maxPrice != null) filter['pricing.hourlyRate'].$lte = maxPrice;
    }
    if (minRating != null) {
      filter.rating = { $gte: minRating };
    }

    const services = await HousekeepingLaundryService.find(filter);
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error('Error searching housekeeping services:', error);
    res.status(500).json({ success: false, error: 'Server error during search' });
  }
};

// RESTORED: Update housekeeping service
const updateHousekeepingService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedService = await HousekeepingLaundryService.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        error: 'Housekeeping service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    console.error('Error updating housekeeping service:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// RESTORED: Delete housekeeping service (soft delete)
const deleteHousekeepingService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await HousekeepingLaundryService.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        error: 'Housekeeping service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Housekeeping service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting housekeeping service:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};


module.exports = {
  createHousekeepingLaundryService,
  getHousekeepingServices,
  getHousekeepingServiceById,
  searchHousekeepingServices,
  updateHousekeepingService, // RESTORED
  deleteHousekeepingService, // RESTORED
};
