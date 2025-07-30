// middleware/authenticateMobile.js
const jwt = require("jsonwebtoken");
const User = require("../models/model"); // Adjust the path to your user model
const SECRET_KEY = "yoursecretkey"; // Ensure this is the same secret key used for signing

const authenticateMobile = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach user information to the request object
    next();
  } catch (err) {
    console.error("Authentication Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateMobile;
