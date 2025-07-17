const mongoose = require("mongoose");

const placestovisitSchema = new mongoose.Schema(
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
    contactno: {
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
    hour: {
      type: Number,
      min: 0,
    },
    min: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Placestovisit || mongoose.model("Placestovisit", placestovisitSchema, 'things_to_do');
