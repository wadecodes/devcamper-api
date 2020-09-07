const router = require('express').Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const advancedResults = require('../middlewares/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// INclude other resource souter
const courseRouter = require('./courses');

const { protect, authorize } = require('../middlewares/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect,  authorize('publisher', 'admin'),updateBootcamp)
  .delete(protect,  authorize('publisher', 'admin'),deleteBootcamp);

module.exports = router;
