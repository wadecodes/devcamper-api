const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [50, 'Title must not be more than 50 characters'],
    trim: true,
    required: [true, 'Please add a title'],
  },
  text: {
    type: String,
    maxlength: [500, 'Title must not be more than 50 characters'],
    required: [true, 'Please add a review'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// static method to get average cost tuitions
ReviewSchema.statics.getAverageReview = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: { _id: '$bootcamp', averageRating: { $avg: '$rating' } },
    },
  ]);
  try {
    console.log(Math.ceil(obj[0].averageRating / 10) * 10);
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageCost after save
ReviewSchema.post('save', async function () {
  await this.constructor.getAverageReview(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre('remove', async function (next) {
  await this.constructor.getAverageReview(this.bootcamp);
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
