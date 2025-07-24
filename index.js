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

// MongoDB Connection
const uri =
  "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/TravelWish";
mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Routes from your original app.js + server.js
const loginRouter = require("./routes/router"); // handles login/signup
app.use("/api", loginRouter);

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
