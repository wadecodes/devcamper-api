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
    console.log('Data Imported'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data

const deleteBootcampData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
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
    console.log('Data Imported'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete Data

const deleteCourseData = async () => {
  try {
    await Course.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-iB') {
  importBootcampsData();
} else if (process.argv[2] === '-dB') {
  deleteBootcampData();
} else if (process.argv[2] === '-iC') {
  importCoursesData();
} else if (process.argv[2] === '-dC') {
  deleteCourseData();
}
