const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

const userController = require('../../controllers/userController');
const { validate } = require('../../utils/middleware');
const checkLogin = require('../../validation/login');
const checkSignup = require('../../validation/signup');
const projectRoutes = require('./projectRoutes');
const protect = passport.authenticate('jwt', { session: false });

// /api/users

router.route('/').get(userController.getUsers);
router.route('/signup').post(validate(checkSignup), userController.signupUser);
router.route('/login').post(validate(checkLogin), userController.loginUser);

// Protected routes
router.route('/current').get(protect, userController.getCurrentUser);
router.route('/:userId').get(protect, userController.getUserById);
router.use('/:userId/projects', protect, projectRoutes);

module.exports = router;
