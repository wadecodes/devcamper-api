const router = require('express').Router();

const { registerUser, loginUser, getMe } = require('../controllers/auth');

const { protect } = require('../middlewares/auth');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

module.exports = router;
