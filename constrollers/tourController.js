const catchAsync = require("./../utils/catchAsync");


exports.getAllTours = catchAsync(async (req, res, next) => {
  res.json({
    status: "success",
    data: "Here is your All Tour",
  });
});
exports.getTourById = catchAsync(async (req, res, next) => {
     res.json({
       status: "success",
       data: "Here is your Tour",
     });
});
exports.createTour = catchAsync(async (req, res, next) => {
     res.json({
       status: "success",
       data: "Created a New Tour",
     });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
     res.json({
       status: "success",
       data: "Deleted Tour",
     });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  res.json({
    status: "success",
    data: "updated Tour",
  });
});