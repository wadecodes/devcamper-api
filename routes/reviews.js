const router = require('express').Router({ mergeParams: true });

const {
  getReviews,
  getReview,
  updateReview,
  createReview,
  deleteReview,
} = require('../controllers/reviews');

const Review = require('../models/Review');

const advancedResults = require('../middlewares/advancedResults');

const { protect, authorize } = require('../middlewares/auth');

router
  .route('/')
  .get(
    advancedResults(Review, { path: 'bootcamp', select: 'name description' }),
    getReviews
  )
  .post(protect, createReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
