const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../../controllers/userController');
const projectRoutes = require('./projectRoutes');
const protect = passport.authenticate('jwt', { session: false });

// /api/users

router.route('/').get(userController.getUsers);
router
  .route('/signup')
  .post(userController.validateSignup, userController.signupUser);
router
  .route('/login')
  .post(userController.validateLogin, userController.loginUser);

// Protected routes
router.route('/current').get(protect, userController.getCurrentUser);
router.route('/:userId').get(protect, userController.getUserById);
router.use('/:userId/projects', protect, projectRoutes);

module.exports = router;
