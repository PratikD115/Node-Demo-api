const tourController = require("./../constrollers/tourController");
const authController = require('./../constrollers/authController')
const express = require("express");
const router = express.Router();

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour)

router
  .route("/:id")
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin'), tourController.deleteTour);
  

module.exports = router;
