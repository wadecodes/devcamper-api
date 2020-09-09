const router = require('express').Router({ mergeParams: true });

const {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/user');

const User = require('../models/User');

const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
