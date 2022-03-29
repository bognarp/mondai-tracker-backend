const Project = require('../models/Project');
const AppError = require('../utils/appError');

const getAllProjects = async (req, res) => {
  const { userId } = req.params;
  const filter = userId
    ? { $or: [{ owners: [userId] }, { members: [userId] }] }
    : {};

  const projects = await Project.find(filter)
    .populate({ path: 'owners', select: 'username' })
    .populate({ path: 'members', select: 'username' })
    .exec();

  res.json(projects);
};

const getProject = async (req, res) => {
  const user = req.user;

  const project = await Project.findById(req.params.projectId)
    .populate({ path: 'owners', select: 'name username email' })
    .populate({ path: 'members', select: 'name username email' })
    .exec();

  if (!project) throw new AppError('Project not found', 404);

  if (!user.isProjectOwner(project._id) && !user.isProjectMember(project._id)) {
    throw new AppError('Forbidden', 403);
  }

  res.json(project);
};

const createProject = async (req, res) => {
  // TODO: validations like User
  const user = req.user;

  const newProject = new Project({
    title: req.body.title,
    description: req.body.description,
    owners: [user._id],
  });

  const savedProject = await newProject.save();
  user.ownProjects = user.ownProjects.concat(savedProject._id);

  await user.save();

  res.json(savedProject);
};

const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const user = req.user;
  const body = req.body;

  const project = await Project.findById(projectId).exec();

  if (!project) throw new AppError('Project not found', 404);
  if (!user.isProjectOwner(projectId)) throw new AppError('Forbidden', 403);

  Object.keys(body).forEach((key) => {
    project[key] = body[key];
  });

  const updatedProject = await project.save();

  const populatedProject = await Project.findById(updatedProject._id)
    .populate({ path: 'owners', select: 'name username email' })
    .populate({ path: 'members', select: 'name username email' })
    .exec();

  res.json(populatedProject);
};

const deleteProject = async (req, res) => {
  const user = req.user;

  const project = await Project.findById(req.params.projectId);
  if (!project) throw new AppError('Project not found', 404);
  if (!user.isProjectOwner(project._id)) throw new AppError('Forbidden', 403);

  await project.deleteOne();

  user.ownProjects.pull(project._id);
  await user.save();

  res.status(204).end();
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
};
