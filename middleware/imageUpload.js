const { upload } = require("../config/cloudinary")
const multer = require("multer")

// Middleware for handling multiple image uploads
const uploadImages = upload.array("images", 5) // Max 5 images

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB per image.",
      })
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum 5 images allowed.",
      })
    }
  }

  if (error && error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed (jpg, jpeg, png, webp, gif).",
    })
  }

  next(error)
}

module.exports = { uploadImages, handleUploadError }
