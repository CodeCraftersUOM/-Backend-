const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust if needed
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection with improved error handling and options
const uri = "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/TravelWish";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    // Try alternative connection string format
    console.log("🔄 Trying alternative connection method...");
    try {
      const alternativeUri = "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/TravelWish?retryWrites=true&w=majority";
      await mongoose.connect(alternativeUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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

// ✅ Additional routes from original index.js
app.use("/api", require("./routes/authenticationRoute"));
app.use("/api", require("./routes/guideRoutes"));
app.use("/api", require("./routes/communiRoutes"));
app.use("/api", require("./routes/repairRoutes"));
app.use("/api", require("./routes/resturentRoutes"));
app.use("/api", require("./routes/healthRoutes"));
app.use("/api", require("./routes/houeskeepingRoutes"));
app.use("/api", require("./routes/taxiRoutes"));
app.use("/api", require("./routes/otherRoutes"));
app.use("/api", require("./routes/accommodationRoutes"));
app.use("/api", require("./routes/cardRoutes"));
app.use("/api", require("./routes/bookingRoutes"));
app.use("/api", require("./routes/notificationRoutes"));
app.use("/api", require("./routes/appNotificationRoutes"));

// Start the server
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
