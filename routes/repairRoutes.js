const express = require("express");
const router = express.Router();
const {
  createVehicleRepairService,
  getRepairServices,
  getRepairServiceById,
  searchRepairServices,
  updateRepairService,
  deleteRepairService,
} = require("../controllers/addRepair");

// Create new repair service
router.post("/addRepair", createVehicleRepairService);

// Get all repair services (with pagination)
router.get("/repairs", getRepairServices);

// Get single repair service by ID
router.get("/repairs/:id", getRepairServiceById);

// Search repair services
router.get("/repairs/search", searchRepairServices);

// Update repair service
router.put("/repairs/:id", updateRepairService);

// Delete repair service (soft delete)
router.delete("/repairs/:id", deleteRepairService);

module.exports = router;