const express = require("express");
const router = express.Router();
const {
  createAccommodationService,
  getAccommodation,
} = require("../controllers/addAccommodation");

router.post("/addAccommodation", createAccommodationService);
router.get("/getAccommodation", getAccommodation);

module.exports = router;
