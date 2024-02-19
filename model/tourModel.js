const mongoose = require('mongoose');

const tourSchema =new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    }
})


const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
