const mongoose = require("mongoose")

const buyThingsSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, trim: true },

    category: { type: String, default: "buythings" },
    subcategory: { type: String, trim: true },

    // Image Information - Updated for Cloudinary
    images: [
      {
        url: { type: String }, // Cloudinary URL
        publicId: { type: String }, // Cloudinary public ID for deletion
        originalName: { type: String }, // Original filename
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Primary image (first image in array)
    primaryImage: { type: String },

    description: { type: String, trim: true },
    location: { type: String, trim: true },
    googleMapsUrl: { type: String, trim: true },
    openingHours: { type: String, trim: true },
    contactno: { type: String, trim: true },
    websiteUrl: { type: String, trim: true },
    entryFee: { type: String, trim: true },
    address: { type: String, trim: true },

    // Payment Methods
    isCard: { type: Boolean, default: false },
    isCash: { type: Boolean, default: true },
    isQRScan: { type: Boolean, default: false },

    // Facilities
    isParking: { type: String, lowercase: true },
    wifi: { type: String, lowercase: true },
    washrooms: { type: String, lowercase: true },
    familyFriendly: { type: String, lowercase: true },

    // Publisher Information
    publisherName: { type: String, trim: true },
    publisherEmail: { type: String, trim: true, lowercase: true },
    publisherPhone: { type: String, trim: true },
    

    // Status
    status: { type: String, default: "pending" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for getting optimized image URLs
buyThingsSchema.virtual("optimizedImages").get(function () {
  return this.images.map((img) => ({
    ...img.toObject(),
    thumbnail: img.url.replace("/upload/", "/upload/w_300,h_200,c_fill,q_auto,f_auto/"),
    medium: img.url.replace("/upload/", "/upload/w_600,h_400,c_fill,q_auto,f_auto/"),
    large: img.url.replace("/upload/", "/upload/w_1200,h_800,c_fill,q_auto,f_auto/"),
  }))
})

module.exports = mongoose.models.BuyThings || mongoose.model("BuyThings", buyThingsSchema);
