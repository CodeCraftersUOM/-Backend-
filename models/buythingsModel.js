const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    
    
    category: {
      type: String,
      required: true,
      enum: [
        "buythings",
        "places",
        "restaurants",
        "events",
        "others", // Add more categories if needed
      ],
    },
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
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
    location: {
      type: String,
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      trim: true,
    },
    openingHours: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String, 
      trim: true     
    },
    entryFee: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const buythings =
    mongoose.models.buythings || mongoose.model("Item", itemSchema, "things_to_do");
module.exports = buythings;
