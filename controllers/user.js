const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');

const User = require('../models/User');

// ** @desc    Get all users
// ** @route   GET /api/v1/auth/users
// ** @access  PRIVATE

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// ** @desc    Get single users
// ** @route   GET /api/v1/auth/users/:id
// ** @access  PRIVATE

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// ** @desc    Create user
// ** @route   POST /api/v1/auth/users/
// ** @access  PRIVATE/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// ** @desc    Update user
// ** @route   PUT /api/v1/auth/users/
// ** @access  PRIVATE/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// ** @desc    Delete user
// ** @route   DELETE /api/v1/auth/users/
// ** @access  PRIVATE/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true });
});
