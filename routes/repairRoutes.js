const express = require("express");
const router = express.Router();
const {
  createVehicleRepairService,
  getRepairServices,
  getRepairServiceById,
  searchRepairServices,
} = require("../controllers/addRepair");

// POST route to create a new repair service (matches your frontend API call)
router.post("/addRepair", createVehicleRepairService);

// GET route to fetch all repair services
router.get("/repairs", getRepairServices);

// GET route to fetch a single repair service by ID
router.get("/repairs/:id", getRepairServiceById);

// POST route for searching repair services
router.post("/repairs/search", searchRepairServices);

module.exports = router;
