const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const asignToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  // sign function of the jwt generate the new token for the user login
  //first parameter is payload of token and in then we send the id of the user
  //second paraeter is secret key that also store in the server to verify the user
  //third parameter is optional it will expire the token in mention time for this project we use 90 day

  const token = asignToken(newUser._id);
  //send that token to the user with the response
  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Destructure the email and password from the req.body
  const { email, password } = req.body;

  console.log("entered password " + password);
  // Check if the email and password are provided
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // Find the user by email
  const user = await User.findOne({ email }).select("+password");
  // If user not found or password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Generate a token
  const token = asignToken(user._id);
  console.log(token);

  // Respond with success and token
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1.getting the token and check is it there or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in Please logged in to get access", 401)
    );
  }
  //2.verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3.check if the user still exist or not
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("User is now no longer exist", 401));
  }
  //4.check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //if the client role match the roles array then client has permisssion to perform that action.

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this Action.", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. get the user from POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email Address", 404));
  }
  //2. generate the resetpassword token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3.send that token to the userMail
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}\n If you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token send to the mail",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email, Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    from: "from the resetpassword",
  });
});
