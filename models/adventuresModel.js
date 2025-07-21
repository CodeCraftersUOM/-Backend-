const mongoose = require("mongoose");

const adventuresSchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: { type: String, required: true },
    
    images: [
  {
    url: String,
    publicId: String,
    originalName: String,
    uploadedAt: { type: Date, default: Date.now },
  },
],

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
module.exports = mongoose.models.Adventures || mongoose.model("Adventures", adventuresSchema);
