const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// ** @desc    Get reviews
// ** @route   GET /api/v1/reviews
// ** @route   GET /api/v1/bootcamps/:bootcampId/reviews
// ** @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// ** @desc    Get review
// ** @route   GET /api/v1/reviews/:id
// ** @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`No review found by the id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({
    success: true,
    data: review,
  });
});

// ** @desc    Create review
// ** @route   POST /api/v1/bootcamps/:bootcampId/reviews
// ** @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// ** @desc    Update review
// ** @route   PUT /api/v1/reviews/:id
// ** @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`)
    );
  }

  if (review.user.toString() !== req.user.id.toString()) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this review ${review._id}`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// ** @desc    DELETE review
// ** @route   DELETEc /api/v1/reviews/:id
// ** @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`)
    );
  }

  if (review.user.toString() !== req.user.id.toString()) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this review ${review._id}`,
        401
      )
    );
  }

  review.remove();
  res.status(200).json({ success: true, removedData: review });
});
