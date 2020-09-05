const router = require('express').Router({ mergeParams: true });

const {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} = require('../controllers/courses');

const advancedResults = require('../middlewares/advancedResults');
const Course = require('../models/Course');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

// router.route

module.exports = router;
