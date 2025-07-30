const Profile = require("../models/Profile");

const saveProfile = async (req, res) => {
  try {
    const { name, email, phone, country } = req.body;
    const newProfile = new Profile({ name, email, phone, country });
    await newProfile.save();
    res.status(200).json({ message: "Profile saved successfully" });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
};

module.exports = { saveProfile };
