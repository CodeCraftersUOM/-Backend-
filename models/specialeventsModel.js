const mongoose = require("mongoose");

const specialEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title for the special event"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
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
      required: [true, "Please add a description"],
    },
    googleMapsUrl: {
      type: String,
      required: [true, "Please provide a Google Maps URL"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date for the event"],
    },
    contactno: {
      type: String,
      required: [true, "Please provide a contact number"],
    },
    bestfor: {
      type: String,
      required: [true, "Please specify who this event is best for"],
    },
    ticketPrice: {
      type: String,
      required: [true, "Please provide the ticket price"],
    },
    dresscode: {
      type: String,
      required: [true, "Please provide the dress code"],
    },
    parking: {
      type: String,
      required: [true, "Please provide parking details"],
    },
    address: {
      type: String,
      required: [true, "Please provide the address"],
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
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.models.specialevents ||  mongoose.model("specialevents", specialEventSchema);

