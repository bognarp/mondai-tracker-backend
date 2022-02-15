const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

const projectController = require('../../controllers/projectController');
const protect = passport.authenticate('jwt', { session: false });

// /api/projects

router.route('/').get(projectController.getAllProjects);

// Protected routes
router.route('/').post(protect, projectController.createProject);
router
  .route('/:projectId')
  .get(protect, projectController.getProject)
  .delete(protect, projectController.deleteProject);

module.exports = router;
