const VehicleRepairService = require("../models/repairModel");

const createVehicleRepairService = async (req, res) => {
  try {
    const serviceData = req.body;

    // Create new vehicle repair service document
    const newService = new VehicleRepairService({
      ...serviceData,
    });

    // Save to database
    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      data: savedService,
    });
  } catch (error) {
    console.error("Error creating vehicle repair service:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: "Validation Failed",
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
      error: "Server error",
    });
  }
};

// Get all repair services
const getRepairServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const repairServices = await VehicleRepairService
      .find({ status: "active" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await VehicleRepairService.countDocuments({ status: "active" });

    res.status(200).json({
      success: true,
      data: repairServices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching repair services:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
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
        error: "Repair service not found",
      });
    }

    console.log("Repair service data fetched by ID");

    res.status(200).json({
      success: true,
      data: repairService,
    });
  } catch (error) {
    console.error("Error fetching repair service by ID:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Search and filter repair services
const searchRepairServices = async (req, res) => {
  try {
    const {
      query,
      minCost,
      maxCost,
      minRating,
      location,
      serviceType,
      vehicleType,
      services,
    } = req.query; // Changed from req.body to req.query for GET request

    let filter = { status: "active" };

    // Text search for name and description
    if (query) {
      filter.$or = [
        {
          serviceName: {
            $regex: query,
            $options: "i",
          },
        },
        {
          serviceDescription: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    // Location search
    if (location) {
      filter.locationAddress = {
        $regex: location,
        $options: "i",
      };
    }

    // Service type filter
    if (serviceType) {
      filter.serviceType = serviceType;
    }

    // Cost range filter
    if (minCost != null || maxCost != null) {
      filter.averageServiceCost = {};
      if (minCost != null) {
        filter.averageServiceCost.$gte = minCost;
      }
      if (maxCost != null) {
        filter.averageServiceCost.$lte = maxCost;
      }
    }

    // Minimum rating filter
    if (minRating != null) {
      filter.rating = {
        $gte: minRating,
      };
    }

    // Vehicle type filter
    if (vehicleType) {
      filter[`vehicleTypesServiced.${vehicleType}`] = true;
    }

    // Specific services filter
    if (services) {
      const serviceArray = services.split(',');
      serviceArray.forEach(service => {
        filter[`servicesOffered.${service}`] = true;
      });
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
      error: "Server error during search",
    });
  }
};

// Update repair service
const updateRepairService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedService = await VehicleRepairService.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        error: "Repair service not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating repair service:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// Delete repair service (soft delete - change status to inactive)
const deleteRepairService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await VehicleRepairService.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true }
    );

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        error: "Repair service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Repair service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting repair service:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  createVehicleRepairService,
  getRepairServices,
  getRepairServiceById,
  searchRepairServices,
  updateRepairService,
  deleteRepairService,
};