const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    maxlength: [50, 'Title must not be more than 50 characters'],
    trim: true,
    required: [true, 'Please add a title'],
  },
  slug: String,
  description: {
    type: String,
    maxlength: [500, 'Title must not be more than 50 characters'],
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add a weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tittuitionle'],
  },
  minimumSkill: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Please add a minimum skill'],
  },
  scholarshipsAvailable: {
    type: Boolean,
    default: false,
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

// static method to get average cost tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } },
    },
  ]);
  try {
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageCost after save
CourseSchema.post('save', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', async function (next) {
  await this.constructor.getAverageCost(this.bootcamp);
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
