const VehicleRepairService = require("../models/repairModel");

const createVehicleRepairService = async (req, res) => {
  try {
    const repairData = req.body;

    // Check for duplicate email or business name
    const existingRepair = await VehicleRepairService.findOne({
      $or: [
        { businessEmailAddress: repairData.businessEmailAddress },
        { businessName: repairData.businessName }
      ]
    });

    if (existingRepair) {
      const duplicateField = existingRepair.businessEmailAddress === repairData.businessEmailAddress ? 'email' : 'business name';
      return res.status(409).json({
        success: false,
        message: `Vehicle repair business with this ${duplicateField} already exists`,
        duplicateField: duplicateField
      });
    }

    // Create new vehicle repair document
    const newRepair = new VehicleRepairService(repairData);

    // Save to database
    const savedRepair = await newRepair.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle repair business registered successfully',
      data: savedRepair,
    });
  } catch (error) {
    console.error("Error creating vehicle repair business:", error);

    if (error.name === "ValidationError") {
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

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all repair services
const getRepairServices = async (req, res) => {
  try {
    const repairServices = await VehicleRepairService.find({})
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: repairServices,
    });
  } catch (error) {
    console.error("Error fetching repair services:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get a single repair service by its ID
const getRepairServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const repairService = await VehicleRepairService.findById(id);

    if (!repairService) {
      return res.status(404).json({
        success: false,
        message: 'Repair service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: repairService,
    });
  } catch (error) {
    console.error("Error fetching repair service by ID:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search and filter repair services
const searchRepairServices = async (req, res) => {
  try {
    const { query, services, location } = req.body;

    let filter = {};

    if (query) {
      filter.$or = [
        { businessName: { $regex: query, $options: "i" } },
        { businessDescription: { $regex: query, $options: "i" } },
        { ownerFullName: { $regex: query, $options: "i" } }
      ];
    }

    if (services && services.length > 0) {
      filter.servicesOffered = { $in: services };
    }

    if (location) {
      filter.locationAddress = { $regex: location, $options: "i" };
    }

    const repairServices = await VehicleRepairService.find(filter);

    res.status(200).json({
      success: true,
      data: repairServices,
    });
  } catch (error) {
    console.error("Error searching repair services:", error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};

module.exports = {
  createVehicleRepairService,
  getRepairServices,
  getRepairServiceById,
  searchRepairServices,
}; 