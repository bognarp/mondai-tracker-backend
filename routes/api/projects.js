const express = require('express');
const passport = require('passport');
const router = express.Router();
const Project = require('../../models/Project');

// /api/projects

router.get('/', (req, res, next) => {
  Project.find({})
    .then((projects) => {
      res.json(projects);
    })
    .catch((err) => {
      next(err);
    });
});

// Protected routes

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const user = req.user;

    const newProject = new Project({
      title: req.body.title,
      owners: [user._id],
    });

    newProject
      .save()
      .then((project) => {
        user.ownProjects = user.ownProjects.concat(project._id);
        user.save();
        res.json(project);
      })
      .catch((err) => next(err));
  }
);

router.delete(
  '/:projectId',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const user = req.user;

    Project.findById(req.params.projectId)
      .then((project) => {
        if (!project) {
          return res.status(404).end();
        }

        if (!user.isProjectOwner(project)) {
          return res.status(403).end();
        }

        Project.deleteById(project._id).then((wat) => {
          console.log('wat is wat', wat);

          user.ownProjects.pull(project._id);
          user.save();
          res.status(204).end();
        });
      })
      .catch((err) => next(err));
  }
);

module.exports = router;
