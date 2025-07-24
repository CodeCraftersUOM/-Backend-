const mongoose = require("mongoose");

const placestovisitSchema = new mongoose.Schema(
  {
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
    tripDuration: {
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
    ticketPrice: {
      type: String,
      trim: true,
    },
    bestTimetoVisit: {
      type: String,
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
    
    address: {
      type: String,
      trim: true,
    },
    bus: {
      type: Boolean,
      default: false,
    },
    taxi: {
      type: Boolean,
      default: false,
    },
    train: {
      type: Boolean,
      default: false,
    },
   
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Placestovisit || mongoose.model("Placestovisit", placestovisitSchema);
