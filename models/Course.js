const mongoose = require('mongoose');

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

module.exports = mongoose.model('Course', CourseSchema);
