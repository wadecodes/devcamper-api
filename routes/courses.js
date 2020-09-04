const router = require('express').Router({ mergeParams: true });

const { getCourses } = require('../controllers/courses');

router.route('/').get(getCourses);

// router.route

module.exports = router;
