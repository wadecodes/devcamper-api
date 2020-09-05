const router = require('express').Router({ mergeParams: true });

const {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} = require('../controllers/courses');

router.route('/').get(getCourses).post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

// router.route

module.exports = router;
