const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  country: String,
  imageUrl: String,  // Will store Cloudinary image URL here
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
