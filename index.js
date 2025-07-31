const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // **CORRECTION 1: Allows requests from any origin for development**
    // IMPORTANT: For production, change '*' to the specific URL of your Flutter web app,
    // e.g., 'https://your-app-domain.com' or 'http://localhost:59761' during local dev
    // if you know the exact port your Flutter web app is running on.
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Content-Type: ${req.get('Content-Type')}`);
  if (req.method === 'POST') {
    console.log('Request body:', req.body);
  }
  next();
});

// MongoDB Connection with improved error handling and options
const uri = "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/TravelWish";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    // Try alternative connection string format
    console.log("🔄 Trying alternative connection method...");
    try {
      const alternativeUri = "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/TravelWish?retryWrites=true&w=majority";
      await mongoose.connect(alternativeUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ Connected to MongoDB Atlas (alternative method)");
    } catch (altError) {
      console.error("❌ Alternative MongoDB connection also failed:", altError.message);
      console.log("🔧 Please check:");
      console.log("1. Internet connection");
      console.log("2. MongoDB Atlas cluster status");
      console.log("3. IP whitelist settings in MongoDB Atlas");
      console.log("4. Username and password in connection string");
      
      // Don't exit the process, but warn about database unavailability
      console.warn("⚠️  Server will continue without database connection");
      console.warn("⚠️  Some features may not work properly");
    }
  }
};

// Connect to MongoDB
connectToMongoDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed due to app termination');
  process.exit(0);
});

// ✅ Routes from your original app.js + server.js
const loginRouter = require("./routes/router"); // handles login/signup (username-based)
app.use("/api/old", loginRouter); // Mount on /api/old to avoid conflict

// **CORRECTION 2: Mount profileRoutes here as well, if it's not already mounted elsewhere.**
// Assuming you have a profileRoutes.js that handles /api/profile endpoints
app.use("/api/profile", require("./routes/profileRoutes")); // <--- Add this line if missing/not explicit

// ✅ Additional routes from original index.js
app.use("/api", require("./routes/authenticationRoute"));
app.use("/api/guides", require("./routes/guideRoutes"));
app.use("/api/communication", require("./routes/communicationServiceRoutes"));
app.use("/api/vehiclerepair", require("./routes/vehicleRepairServiceRoutes"));
app.use("/api/resturent", require("./routes/resturentRoutes"));
app.use("/api/health", require("./routes/healthRoutes"));
app.use("/api/houeskeeping", require("./routes/houeskeepingRoutes"));
app.use("/api/taxi", require("./routes/taxiRoutes"));
app.use("/api/other", require("./routes/otherRoutes"));
app.use("/api/accommodation", require("./routes/accommodationRoutes"));
app.use("/api/card", require("./routes/cardRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/appNotification", require("./routes/appNotificationRoutes"));


// Start the server
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});