const CommunicationService = require("../models/communicationServiceModel");

// @desc Create new Communication Service
// @route POST /api/communication-services
exports.createService = async (req, res) => {
  try {
    const service = await CommunicationService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Communication service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Get all Communication Services
// @route GET /api/communication-services
exports.getAllServices = async (req, res) => {
  try {
    const services = await CommunicationService.find();
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single Communication Service by ID
// @route GET /api/communication-services/:id
exports.getServiceById = async (req, res) => {
  try {
    const service = await CommunicationService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update Communication Service
// @route PUT /api/communication-services/:id
exports.updateService = async (req, res) => {
  try {
    const service = await CommunicationService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, message: "Service updated successfully", data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Delete Communication Service
// @route DELETE /api/communication-services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await CommunicationService.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
