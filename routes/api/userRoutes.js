const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../../controllers/userController');

router.route('/').get(userController.getUsers);
router
  .route('/signup')
  .post(userController.validateSignup, userController.signupUser);
router
  .route('/login')
  .post(userController.validateLogin, userController.loginUser);

// Protected routes
router.use(passport.authenticate('jwt', { session: false }));
router.route('/current').get(userController.getCurrentUser);

module.exports = router;
