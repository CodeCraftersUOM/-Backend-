const VehicleRepairService = require("../models/vehicleRepairServiceModel");

// CREATE a new vehicle repair service
exports.createVehicleRepairService = async (req, res) => {
  try {
    const service = await VehicleRepairService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle repair service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET all vehicle repair services
exports.getAllVehicleRepairServices = async (req, res) => {
  try {
    const services = await VehicleRepairService.find();
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single vehicle repair service by ID
exports.getVehicleRepairServiceById = async (req, res) => {
  try {
    const service = await VehicleRepairService.findById(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle repair service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE vehicle repair service
exports.updateVehicleRepairService = async (req, res) => {
  try {
    const service = await VehicleRepairService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle repair service not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle repair service updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE vehicle repair service
exports.deleteVehicleRepairService = async (req, res) => {
  try {
    const service = await VehicleRepairService.findByIdAndDelete(req.params.id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle repair service not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle repair service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
