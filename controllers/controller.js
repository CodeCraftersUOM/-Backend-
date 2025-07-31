const User = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Use a secure, environment-specific secret key in a real application
const SECRET_KEY = "yoursecretkey";

// GET ALL USERS
const getUsers = (req, res, next) => {
  User.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
};

// ADD A NEW USER (SIGN UP)
const addUser = async (req, res) => {
  try {
    // Check if a user with the same username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      // If user exists, return a 409 Conflict status
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Respond with a 201 Created status for success
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // If credentials are correct, create a JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE USER (Example - implementation may vary)
const updateUser = (req, res, next) => {
  const { id, username } = req.body; // Assuming you pass user ID and new username
  User.updateOne({ _id: id }, { $set: { username: username } })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
};

// DELETE USER (Example - implementation may vary)
const deleteUser = (req, res, next) => {
  const { id } = req.body; // Assuming you pass user ID
  User.deleteOne({ _id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
};

// Export all controller functions
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.loginUser = loginUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
