const mongoose = require("mongoose");

const adventuresSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    bestfor: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    bestTimetoVisit: {
      type: Date,
    },
    activities: {
      type: String,
      trim: true,
    },
    whatToWear: {
      type: String,
      trim: true,
    },
    whatToBring: {
      type: String,
      trim: true,
    },
    precautions: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Export model
module.exports =
  mongoose.models.Item || mongoose.model("Item", adventuresSchema, 'things_to_do');
