const Place = require("../models/placestovisitModel"); // Adjust path if needed

// 🆕 Create a new place to visit
const createPlace = async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(400).json({ message: "Failed to create place", error: error.message });
  }
};

// 📥 Get all places to visit
const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({});
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch places", error: error.message });
  }
};

// 🔍 Get a single place by ID
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving place", error: error.message });
  }
};

// ✏️ Update a place
const updatePlace = async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(400).json({ message: "Failed to update place", error: error.message });
  }
};

// 🗑️ Delete a place
const deletePlace = async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting place", error: error.message });
  }
};

module.exports = {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
};
