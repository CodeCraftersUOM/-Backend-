const express = require("express");
console.log("Express loaded successfully");

const cors = require("cors");
console.log("CORS loaded successfully");

try {
  const model = require("./model");
  console.log("Model loaded successfully");
} catch (error) {
  console.error("Error loading model:", error.message);
}

try {
  const mongoose = require("mongoose");
  console.log("Mongoose loaded successfully");
} catch (error) {
  console.error("Error loading mongoose:", error.message);
}

try {
  const authenticationRoute = require("./routes/authenticationRoute");
  console.log("Authentication route loaded successfully");
} catch (error) {
  console.error("Error loading authentication route:", error.message);
}

console.log("Test completed");
