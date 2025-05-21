const express = require("express");
const app = express();
const cors = require("cors");
const controller = require("./controllers/controller");

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const router = require("./routers/router");

module.exports = app;
