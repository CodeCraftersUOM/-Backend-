const express = require("express");
const app = express();
const cors = require("cors"); // ✅ Import cors
const model = require("./model");
const mongoose = require("mongoose");
const authenticationRoute = require('./routes/authenticationRoute');

// ✅ Use CORS middleware
app.use(cors({
  origin: "http://localhost:3000", // 👈 your frontend URL
  credentials: true               // 👈 allow cookies if needed
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const data = [];

// Connect to Mongoose
mongoose.connect(
    "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/TravelWish"
  )
  .then(() => {
    console.log("Connected to MongoDB");

    app.post("/api/add_data", async (req, res) => {
      console.log("result", req.body);

      let data2 = model(req.body);
      try {
        let dataToStore = await data2.save();
        res.status(200).json(dataToStore);
      } catch (error) {
        res.status(400).json({
          message: "Error saving data",
          error: error.message,
        });
      }
    });

    app.get("/api/get_data", (req, res) => {
      if (data.length > 0) {
        res.status(200).send({
          status_code: 200,
          message: data,
        });
      } else {
        res.status(404).send({
          status_code: 404,
          message: "No data found",
        });
      }
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Web APIs
app.use('/api', authenticationRoute);

app.listen(2000, () => {
  console.log("Server is running on port 2000");
});
