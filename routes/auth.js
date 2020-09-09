const router = require('express').Router();

const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetpassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');

const { protect } = require('../middlewares/auth');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

router.post('/forgotpassword', forgotPassword);

router.post('/resetpassword/:token', resetpassword);

router.put('/updatedetails', protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

module.exports = router;
