const express = require("express");

const userRoutes = require("./routes/userRoutes");
const tourRoutes = require("./routes/tourRoutes");

const app = express();

// MIDDLEWARE
// that convert the request object to the json format
app.use(express.json());

app.use((req, res, next) => {
  //it's basically assign the request time to the requestTime to req object.
  //and print the req.header
  req.requestTime = new Date().toISOString();
  // for check the request header ;
  console.log(req.headers);
  next();
});

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tour", tourRoutes);

//exports the app module
module.exports = app;
