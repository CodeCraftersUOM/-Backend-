const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authenticationRoute = require("./routes/authenticationRoute");
const guideRoutes = require("./routes/guideRoutes");
const communiRoutes = require("./routes/communiRoutes");
const repairRoutes = require("./routes/repairRoutes");
const resturentRoutes = require("./routes/resturentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const houeskeepingRoutes = require("./routes/houeskeepingRoutes");
const taxiRoutes = require("./routes/taxiRoutes");
const otherRoutes = require("./routes/otherRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const cardRoutes = require("./routes/cardRoutes");

const buythingsRoute = require("./routes/buythingsRoute");
const adventuresRoute = require("./routes/adventuresRoute");
const reviewsRoute = require("./routes/reviewsRoute");
const placestovisitRoutes = require("./routes/placestovisitRoutes");
const specialeventsRoutes = require("./routes/specialeventsRoutes");
const learningpointsRoutes = require("./routes/learningpointsRoutes");

const bookingRoutes = require("./routes/bookingRoutes");

const cookieParser = require("cookie-parser"); // ✅ Enables req.cookies

mongoose.connection.once('open', async () => {
  const collections = [
    'things_to_do',
    'specialevents',
    'learningpoints',
    'buythings',
    'adventures'
  ];

  for (const collectionName of collections) {
    try {
      const result = await mongoose.connection.db
        .collection(collectionName)
        .dropIndex('id_1');
      cons
