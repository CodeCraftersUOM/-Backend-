const express = require("express");
const router = express.Router();
const {
  createVehicleRepairService,
  getAllVehicleRepairServices,
  getVehicleRepairServiceById,
  updateVehicleRepairService,
  deleteVehicleRepairService,
} = require("../controllers/vehicleRepairServiceController");

// Create new vehicle repair service
router.post("/", createVehicleRepairService);

// Get all vehicle repair services
router.get("/", getAllVehicleRepairServices);

// Get single vehicle repair service by ID
router.get("/:id", getVehicleRepairServiceById);

// Update vehicle repair service
router.put("/:id", updateVehicleRepairService);

// Delete vehicle repair service
router.delete("/:id", deleteVehicleRepairService);

module.exports = router;
