const express = require('express');
const passport = require('passport');
const router = express.Router();

const projectController = require('../../controllers/projectController');

// /api/projects

router.route('/').get(projectController.getAllProjects);

// Protected routes
router.use(passport.authenticate('jwt', { session: false }));
router.route('/').post(projectController.createProject);
router.route('/:projectId').delete(projectController.deleteProject);

module.exports = router;
