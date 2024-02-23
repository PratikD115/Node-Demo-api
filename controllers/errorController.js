const AppError = require("../utils/appError");

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplciateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  console.log(value);

  const message = `Duplicate field vlaue x. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.erroes).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // in the production mode this code only for those error who knows about those error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //unknown error that we have no idea about the error
  // so we do not want to leak the error message to the clinet ofr security purpose
  else {
    //1. log the error to the console
    console.error("ERROR", err);

    //2. send the generic error to the client
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplciateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
