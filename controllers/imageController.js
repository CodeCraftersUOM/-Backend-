const { cloudinary } = require("../config/cloudinary")

/**
 * Upload single image
 */
const uploadSingleImage = async (req, res) => {
  try {
    console.log("📸 Single image upload request received")
    console.log("File:", req.file)

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      })
    }

    const imageData = {
      url: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public ID
      originalName: req.file.originalname,
      size: req.file.size,
      format: req.file.format || req.file.mimetype.split("/")[1],
      uploadedAt: new Date(),
    }

    console.log("✅ Image uploaded successfully:", imageData)

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: imageData,
    })
  } catch (error) {
    console.error("❌ Error uploading single image:", error)

    // Clean up uploaded image if there was an error
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename)
        console.log(`🗑️ Cleaned up image: ${req.file.filename}`)
      } catch (deleteError) {
        console.error(`❌ Error cleaning up image: ${deleteError.message}`)
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    })
  }
}

/**
 * Upload multiple images
 */
const uploadMultipleImages = async (req, res) => {
  try {
    console.log("📸 Multiple images upload request received")
    console.log("Files:", req.files)

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      })
    }

    const imagesData = req.files.map((file) => ({
      url: file.path, // Cloudinary URL
      publicId: file.filename, // Cloudinary public ID
      originalName: file.originalname,
      size: file.size,
      format: file.format || file.mimetype.split("/")[1],
      uploadedAt: new Date(),
    }))

    console.log(`✅ ${imagesData.length} images uploaded successfully`)

    res.status(200).json({
      success: true,
      message: `${imagesData.length} images uploaded successfully`,
      data: {
        images: imagesData,
        count: imagesData.length,
        primaryImage: imagesData[0], // First image as primary
      },
    })
  } catch (error) {
    console.error("❌ Error uploading multiple images:", error)

    // Clean up uploaded images if there was an error
    if (req.files && req.files.length > 0) {
      console.log("🧹 Cleaning up uploaded images due to error...")
      for (const file of req.files) {
        try {
          await cloudinary.uploader.destroy(file.filename)
          console.log(`🗑️ Cleaned up image: ${file.filename}`)
        } catch (deleteError) {
          console.error(`❌ Error cleaning up image ${file.filename}:`, deleteError.message)
        }
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload images",
      error: error.message,
    })
  }
}

/**
 * Delete image from Cloudinary
 */
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      })
    }

    console.log(`🗑️ Deleting image with public ID: ${publicId}`)

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === "ok") {
      console.log(`✅ Image deleted successfully: ${publicId}`)
      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: { publicId, result },
      })
    } else {
      console.log(`⚠️ Image not found or already deleted: ${publicId}`)
      res.status(404).json({
        success: false,
        message: "Image not found or already deleted",
        data: { publicId, result },
      })
    }
  } catch (error) {
    console.error("❌ Error deleting image:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    })
  }
}

/**
 * Get image details from Cloudinary
 */
const getImageDetails = async (req, res) => {
  try {
    const { publicId } = req.params

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      })
    }

    console.log(`📋 Getting image details for: ${publicId}`)

    // Get image details from Cloudinary
    const result = await cloudinary.api.resource(publicId)

    res.status(200).json({
      success: true,
      message: "Image details retrieved successfully",
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: result.created_at,
        resourceType: result.resource_type,
      },
    })
  } catch (error) {
    console.error("❌ Error getting image details:", error)

    if (error.http_code === 404) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to get image details",
      error: error.message,
    })
  }
}

/**
 * Get optimized image URLs
 */
const getOptimizedImageUrls = async (req, res) => {
  try {
    const { publicId } = req.params
    const { width, height, quality = "auto", format = "auto" } = req.query

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      })
    }

    // Generate different sized URLs
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`

    const optimizedUrls = {
      original: `${baseUrl}/${publicId}`,
      thumbnail: `${baseUrl}/w_300,h_200,c_fill,q_${quality},f_${format}/${publicId}`,
      small: `${baseUrl}/w_400,h_300,c_fill,q_${quality},f_${format}/${publicId}`,
      medium: `${baseUrl}/w_600,h_400,c_fill,q_${quality},f_${format}/${publicId}`,
      large: `${baseUrl}/w_1200,h_800,c_fill,q_${quality},f_${format}/${publicId}`,
    }

    // Add custom size if provided
    if (width && height) {
      optimizedUrls.custom = `${baseUrl}/w_${width},h_${height},c_fill,q_${quality},f_${format}/${publicId}`
    }

    res.status(200).json({
      success: true,
      message: "Optimized URLs generated successfully",
      data: {
        publicId,
        urls: optimizedUrls,
      },
    })
  } catch (error) {
    console.error("❌ Error generating optimized URLs:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate optimized URLs",
      error: error.message,
    })
  }
}

/**
 * Bulk delete images
 */
const bulkDeleteImages = async (req, res) => {
  try {
    const { publicIds } = req.body

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of public IDs is required",
      })
    }

    console.log(`🗑️ Bulk deleting ${publicIds.length} images`)

    const deleteResults = []
    const errors = []

    // Delete each image
    for (const publicId of publicIds) {
      try {
        const result = await cloudinary.uploader.destroy(publicId)
        deleteResults.push({
          publicId,
          result: result.result,
          success: result.result === "ok",
        })
        console.log(`✅ Deleted: ${publicId}`)
      } catch (error) {
        errors.push({
          publicId,
          error: error.message,
        })
        console.error(`❌ Failed to delete ${publicId}:`, error.message)
      }
    }

    const successCount = deleteResults.filter((r) => r.success).length
    const failureCount = errors.length

    res.status(200).json({
      success: true,
      message: `Bulk delete completed. ${successCount} successful, ${failureCount} failed`,
      data: {
        results: deleteResults,
        errors,
        summary: {
          total: publicIds.length,
          successful: successCount,
          failed: failureCount,
        },
      },
    })
  } catch (error) {
    console.error("❌ Error in bulk delete:", error)
    res.status(500).json({
      success: false,
      message: "Failed to bulk delete images",
      error: error.message,
    })
  }
}

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getImageDetails,
  getOptimizedImageUrls,
  bulkDeleteImages,
}

