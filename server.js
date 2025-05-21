const express = require("express");
const app = express();
const cors = require("cors");
const port = 2000;
const host = "0.0.0.0";
const mongoose = require("mongoose");
const router = require("./routes/router");
const controller = require("./controllers/controller");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://chandupa:81945124@cluster0.fmyrf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

app.use("/api", router);

connect();
const server = app.listen(port, host, () => {
  console.log(`Server is listening to ${server.address().port}`);
});
