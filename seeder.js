// Core packages
const fs = require('fs/promises');

// npm packages
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files

const importBootcampsData = async () => {
  try {
    const bootcamps = JSON.parse(
      await fs.readFile(`${__dirname}/_data/bootcamps.json`, 'utf-8')
    );
    await Bootcamp.create(bootcamps);
    console.log('Bootcamps Data Imported'.green.inverse);
  } catch (err) {
    console.log(err);
  }
};

// Delete Data

const deleteBootcampData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Bootcamps Data Destroyed'.red.inverse);
  } catch (err) {
    console.log(err);
  }
};

const importCoursesData = async () => {
  try {
    const courses = JSON.parse(
      await fs.readFile(`${__dirname}/_data/courses.json`, 'utf-8')
    );
    await Course.create(courses);
    console.log('Courses Data Imported'.green.inverse);
  } catch (err) {
    console.log(err);
  }
};

// Delete Data

const deleteCourseData = async () => {
  try {
    await Course.deleteMany();
    console.log('Courses Data Destroyed'.red.inverse);
  } catch (err) {
    console.log(err);
  }
};

const importUsersData = async () => {
  try {
    const users = JSON.parse(
      await fs.readFile(`${__dirname}/_data/users.json`, 'utf-8')
    );
    await User.create(users);
    console.log('Users Data Imported'.green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteUserData = async () => {
  try {
    await User.deleteMany();
    console.log('Users Data Destroyed'.red.inverse);
  } catch (err) {
    console.log(err);
  }
};

const importReviewsData = async () => {
  try {
    const reviews = JSON.parse(
      await fs.readFile(`${__dirname}/_data/reviews.json`, 'utf-8')
    );
    await Review.create(reviews);
    console.log('Reviews Data Imported'.green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteReviewData = async () => {
  try {
    await Review.deleteMany();
    console.log('Reviews Data Destroyed'.red.inverse);
  } catch (err) {
    console.log(err);
  }
};

async function init() {
  if (process.argv[2] === '-i') {
    await importUsersData();
    await importBootcampsData();
    await importCoursesData();
    await importReviewsData();
  } else if (process.argv[2] === '-d') {
    await deleteUserData();
    await deleteBootcampData();
    await deleteCourseData();
    await deleteReviewData();
  }
  process.exit();
}

init();
