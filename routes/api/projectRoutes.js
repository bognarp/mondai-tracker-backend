const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

const projectController = require('../../controllers/projectController');
const { validate } = require('../../utils/middleware');
const checkProject = require('../../validation/project');
const storyRoutes = require('./storyRoutes');
const protect = passport.authenticate('jwt', { session: false });

// /api/projects
// TODO: this should be protected
router.route('/').get(projectController.getAllProjects);

// Protected routes
router.use(protect);
router.route('/').post(validate(checkProject), projectController.createProject);
router
  .route('/:projectId')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);
router
  .route('/:projectId/members/:userId')
  .post(projectController.acceptInvite);
// .delete(projectController.removeMember);
router.use('/:projectId/stories', storyRoutes);

module.exports = router;
