const express = require("express");
const router = express.Router();

// Example POST endpoint for card details
router.post("/createCardDetail", async (req, res) => {
  // TODO: Save card details to DB (add validation and security!)
  res.status(200).json({ message: "Card details received" });
});

module.exports = router;
