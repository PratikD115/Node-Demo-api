const express = require("express");


const userRoutes = require("./routes/userRoutes");
const globalErrorHandler = require('./controllers/errorController')
const tourRoutes = require("./routes/tourRoutes");
const AppError = require("./utils/appError");

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

//if above routes can not handle the request then it must be a unhandled route and we need to send a res with error
//so first we need to create the error using the AppError class then send a response using the errorcontroller 
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
//exports the app module
module.exports = app;
