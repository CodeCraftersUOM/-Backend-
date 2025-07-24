const express = require("express")
const router = express.Router()
const { uploadImages, uploadSingleImage, handleUploadError } = require("../middleware/uploadMiddleware")
const {
  uploadSingleImage: uploadSingle,
  uploadMultipleImages,
  deleteImage,
  getImageDetails,
  getOptimizedImageUrls,
  bulkDeleteImages,
} = require("../controllers/imageController")

// Upload routes
router.post("/upload/single", uploadSingleImage, uploadSingle)
router.post("/upload/multiple", uploadImages, uploadMultipleImages)

// Image management routes
router.get("/details/:publicId", getImageDetails)
router.get("/optimized/:publicId", getOptimizedImageUrls)
router.delete("/:publicId", deleteImage)
router.post("/bulk-delete", bulkDeleteImages)

// Error handling middleware
router.use(handleUploadError)

module.exports = router
