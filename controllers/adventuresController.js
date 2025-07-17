const Adventure = require("../models/adventuresModel"); // Adjust path if needed

// 🆕 Create a new adventure
const createAdventure = async (req, res) => {
  try {
    const newAdventure = new Adventure(req.body);
    const savedAdventure = await newAdventure.save();
    res.status(201).json(savedAdventure);
  } catch (error) {
    res.status(400).json({ message: "Failed to create adventure", error: error.message });
  }
};

// 📥 Get all adventures
const getAdventures = async (req, res) => {
  try {
    const adventures = await Adventure.find({});
    res.status(200).json(adventures);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch adventures", error: error.message });
  }
};

// 🔍 Get a single adventure by ID
const getAdventureById = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) {
      return res.status(404).json({ message: "Adventure not found" });
    }
    res.status(200).json(adventure);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving adventure", error: error.message });
  }
};

// ✏️ Update an adventure
const updateAdventure = async (req, res) => {
  try {
    const updatedAdventure = await Adventure.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedAdventure) {
      return res.status(404).json({ message: "Adventure not found" });
    }
    res.status(200).json(updatedAdventure);
  } catch (error) {
    res.status(400).json({ message: "Failed to update adventure", error: error.message });
  }
};

// 🗑️ Delete an adventure
const deleteAdventure = async (req, res) => {
  try {
    const deletedAdventure = await Adventure.findByIdAndDelete(req.params.id);
    if (!deletedAdventure) {
      return res.status(404).json({ message: "Adventure not found" });
    }
    res.status(200).json({ message: "Adventure deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting adventure", error: error.message });
  }
};

module.exports = {
  createAdventure,
  getAdventures,
  getAdventureById,
  updateAdventure,
  deleteAdventure,
};
