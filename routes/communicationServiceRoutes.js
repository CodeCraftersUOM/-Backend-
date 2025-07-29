const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/communicationServiceController");

// Create new service
router.post("/", createService);

// Get all services
router.get("/", getAllServices);

// Get single service by ID
router.get("/:id", getServiceById);

// Update service
router.put("/:id", updateService);

// Delete service
router.delete("/:id", deleteService);

module.exports = router;
