const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");

// 🆕 Create a new review
router.post("/reviews", createReview);

// 📥 Get all reviews
router.get("/reviews", getAllReviews);

// 🔍 Get a single review by ID
router.get("/reviews/:id", getReviewById);

// ✏️ Update a review by ID
router.put("/reviews/:id", updateReview);

// 🗑️ Delete a review by ID
router.delete("/reviews/:id", deleteReview);

module.exports = router;
