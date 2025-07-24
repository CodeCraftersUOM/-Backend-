const HousekeepingLaundryService = require('../models/housekeepingModel');

const createHousekeepingLaundryService = async (req, res) => {
  try {
    const serviceData = req.body;

    // Create new document
    const newService = new HousekeepingLaundryService({
      ...serviceData,
    });

    // Save to MongoDB
    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      data: savedService,
    });
  } catch (error) {
    console.error('Error creating housekeeping/laundry service:', error);

    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: 'Validation Failed',
        details: errors,
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get all housekeeping services
const getHousekeepingServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const services = await HousekeepingLaundryService
      .find({ status: 'active' })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await HousekeepingLaundryService.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching housekeeping services:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Get a single housekeeping service by its ID
const getHousekeepingServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await HousekeepingLaundryService.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Housekeeping service not found',
      });
    }

    console.log('Housekeeping service data fetched by ID');

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error fetching housekeeping service by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// Search and filter housekeeping services
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
    } = req.query;

    let filter = { status: 'active' };

    // Text search for business name and description
    if (query) {
      filter.$or = [
        {
          businessName: {
            $regex: query,
            $options: 'i',
          },
        },
        {
          businessDescription: {
            $regex: query,
            $options: 'i',
          },
        },
      ];
    }

    // Service area search
    if (serviceArea) {
      filter.serviceArea = {
        $regex: serviceArea,
        $options: 'i',
      };
    }

    // Service type filter
    if (serviceType) {
      filter.serviceTypes = {
        $in: [serviceType],
      };
    }

    // Pricing method filter
    if (pricingMethod) {
      filter.pricingMethod = pricingMethod;
    }

    // Price range filter (hourly rate)
    if (minPrice != null || maxPrice != null) {
      filter['pricing.hourlyRate'] = {};
      if (minPrice != null) {
        filter['pricing.hourlyRate'].$gte = minPrice;
      }
      if (maxPrice != null) {
        filter['pricing.hourlyRate'].$lte = maxPrice;
      }
    }

    // Minimum rating filter
    if (minRating != null) {
      filter.rating = {
        $gte: minRating,
      };
    }

    const services = await HousekeepingLaundryService.find(filter);

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error searching housekeeping services:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during search',
    });
  }
};

// Update housekeeping service
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

// Delete housekeeping service (soft delete)
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
  updateHousekeepingService,
  deleteHousekeepingService,
};