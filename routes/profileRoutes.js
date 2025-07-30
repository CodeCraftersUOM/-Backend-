const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const cloudinary = require('../cloudinaryConfig');
const multer = require('multer');
const DatauriParser = require('datauri/parser');
const path = require('path');

// Multer setup for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to convert buffer to DataURI (Cloudinary accepts base64 or file path)
const parser = new DatauriParser();

router.post('/save', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, phone, country } = req.body;

    let imageUrl = '';

    if (req.file) {
      // Convert buffer to Data URI string
      const file64 = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file64.content, {
        folder: 'travelWishProfiles', // optional folder name in Cloudinary
      });

      imageUrl = result.secure_url;
    }

    // Save profile data in MongoDB
    const newProfile = new Profile({
      name,
      email,
      phone,
      country,
      imageUrl,
    });

    await newProfile.save();

    res.status(200).json({ message: 'Profile saved successfully', data: newProfile });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

module.exports = router;
