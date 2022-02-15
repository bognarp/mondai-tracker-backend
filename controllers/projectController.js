const Project = require('../models/Project');

const getAllProjects = (req, res, next) => {
  const { userId } = req.params;
  const filter = userId
    ? { $or: [{ owners: [userId] }, { members: [userId] }] }
    : {};

  Project.find(filter)
    .then((projects) => {
      res.json(projects);
    })
    .catch((err) => {
      next(err);
    });
};

const getProject = (req, res, next) => {
  const user = req.user;

  Project.findById(req.params.projectId)
    .then((project) => {
      if (!project) return res.status(404).end();

      if (!user.isProjectOwner(project) && !user.isProjectMember(project)) {
        return res.status(403).end();
      }

      res.json(project);
    })
    .catch((err) => next(err));
};

const createProject = (req, res, next) => {
  // TODO: validations
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
};

const deleteProject = (req, res, next) => {
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
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
};
