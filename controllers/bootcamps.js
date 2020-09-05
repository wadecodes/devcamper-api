const path = require('path');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async');

const geocoder = require('../utils/geocoder');

const Bootcamp = require('../models/Bootcamp');

// ** @desc    Get all Bootcamps
// ** @route   GET /api/v1/bootcamps
// ** @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  console.log(res.advancedResults);
  res.status(200).json(res.advancedResults);
});

// ** @desc    Get single Bootcamps
// ** @route   GET /api/v1/bootcamps/:id
// ** @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp did not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// ** @desc    Create new Bootcamp
// ** @route   POST /api/v1/bootcamps
// ** @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// ** @desc    Edit Bootcamp
// ** @route   PUT /api/v1/bootcamps/:id
// ** @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp did not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// ** @desc    Delete Bootcamp
// ** @route   DELETE /api/v1/bootcamps/:id
// ** @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp did not found with id of ${req.params.id}`,
        404
      )
    );
  }

  bootcamp.remove();
  res.status(200).json({ success: true, deletedData: bootcamp });
});

// ** @desc    Get Bootcamps within a radius
// ** @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// ** @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const { latitude: lat, longitude: lng } = loc[0];

  // Calc radius using radians
  // Divide dist by radius of Earth
  //Earth Radius = 3,963 mi or 6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// ** @desc    Upload photo for Bootcamp
// ** @route   PUT /api/v1/bootcamps/:id/photo
// ** @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp did not found with id of ${req.params.id}`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  // Make sure the image is a photo

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }
  if (!file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({ success: true, data: file.name });
  });
});
