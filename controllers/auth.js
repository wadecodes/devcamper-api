const crypto = require('crypto');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const Bootcamp = require('../models/Bootcamp');
const sendMail = require('../utils/sendEmail');

// ** @desc    Register User
// ** @route   GET /api/v1/auth/register
// ** @access  Public

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  //Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 201, res);
});

// ** @desc    Login User
// ** @route   POST /api/v1/auth/login
// ** @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide an email and password`));
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`Email does not exists`));
  }
  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid email or password`));
  }

  sendTokenResponse(user, 200, res);
});

// ** @desc    Get current logged in user
// ** @route   GET /api/v1/auth/me
// ** @access  Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ** @desc    Generate Forgot Password Token
// ** @route   POST /api/v1/auth/forgotpassword
// ** @access  Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(
        `No account found with the email ${req.body.email}`,
        404
      )
    );
  }

  const resetToken = await user.getResetPasswordToken();

  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
      data: 'Email sent',
      resetPasswordExpiration: user.resetPasswordExpiration.toString(),
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

// ** @desc    resetpassword
// ** @route   POST /api/v1/auth/resetpassword/:token
// ** @access  Public

exports.resetpassword = asyncHandler(async (req, res, next) => {
  //Get hashedh token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiration = undefined;

  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// ** @desc    Update Details
// ** @route   POST /api/v1/auth/updatedetails/
// ** @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  console.log(fieldsToUpdate);

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ** @desc    Update Password
// ** @route   POST /api/v1/auth/updatepassword/
// ** @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`Incorrect Password`, 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// ** Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  // generate token and sending with response
  const token = await user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
