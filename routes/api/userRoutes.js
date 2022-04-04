const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

const userController = require('../../controllers/userController');
const { validate } = require('../../utils/middleware');
const checkLogin = require('../../validation/login');
const checkSignup = require('../../validation/signup');
const checkUserUpdate = require('../../validation/userUpdate');
const projectRoutes = require('./projectRoutes');
const protect = passport.authenticate('jwt', { session: false });

// /api/users

router.route('/').get(userController.getUsers);
router.route('/signup').post(validate(checkSignup), userController.signupUser);
router.route('/login').post(validate(checkLogin), userController.loginUser);

// Protected routes
router.use(protect);
router.route('/current').get(userController.getCurrentUser);
router
  .route('/:userId')
  .get(userController.getUserById)
  .patch(validate(checkUserUpdate), userController.updateUser);

router.route('/:userId/invites').post(userController.sendInvite);
// router
//   .route('/:userId/invites/:inviteId')
//   .delete(userController.removeUserInvite);

router.use('/:userId/projects', projectRoutes);

module.exports = router;
