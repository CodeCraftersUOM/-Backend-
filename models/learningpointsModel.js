const mongoose = require("mongoose");

const learningPointSchema = new mongoose.Schema(
  { 
   
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
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
      required: true,
    },
    googleMapsUrl: {
      type: String,
    },
    duration: {
      type: String,
    },
    contactno: {
      type: String,
    },
    bestfor: {
      type: String,
    },
    avgprice: {
      type: String,
    },
    tourname: {
      type: Object,
      default: {},
    },
    price: {
      type: Object,
      default: {},
    },
    websiteUrl: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("LearningPoint", learningPointSchema);


