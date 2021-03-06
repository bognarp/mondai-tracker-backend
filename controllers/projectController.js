const Project = require('../models/Project');
const User = require('../models/User');
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
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
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
  const user = req.user;

  const newProject = new Project({
    title: req.body.title,
    description: req.body.description,
    avatar: req.body.avatar,
    owners: [user._id],
  });

  const savedProject = await newProject.save();
  user.ownProjects = user.ownProjects.concat(savedProject._id);

  await user.save();

  res.json(savedProject);
};

const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { user, body } = req;
  const disabledFields = ['members', 'owners'];
  const patchObj = { ...body };

  disabledFields.forEach((field) => {
    delete patchObj[field];
  });

  const project = await Project.findById(projectId).exec();

  if (!project) throw new AppError('Project not found', 404);
  if (!user.isProjectOwner(projectId)) throw new AppError('Forbidden', 403);

  Object.keys(patchObj).forEach((key) => {
    project[key] = patchObj[key];
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

const acceptInvite = async (req, res) => {
  const user = req.user;
  const { projectId, userId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) throw new AppError('Project not found', 404);
  if (!user.equals(userId)) throw new AppError('Forbidden', 403);

  const newMember = await User.findById(userId).exec();

  if (!newMember) throw new AppError('User not found', 404);
  if (!newMember.invites.some((invite) => project.equals(invite.project))) {
    throw new AppError('No pending invites to this project', 403);
  }

  newMember.memberProjects.addToSet(project._id);
  newMember.invites = newMember.invites.filter((invite) => {
    return !project.equals(invite.project);
  });
  project.members.addToSet(newMember._id);

  await newMember.save();
  await project.save();

  res.status(204).end();
};

const removeMember = async (req, res) => {
  const user = req.user;
  const { projectId, userId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) throw new AppError('Project not found', 404);
  if (!user.isProjectOwner(project._id) && !user.equals(userId)) {
    throw new AppError('Forbidden', 403);
  }

  const projectMember = await User.findById(userId).exec();

  if (!projectMember) throw new AppError('User not found', 404);

  projectMember.memberProjects = projectMember.memberProjects.filter(
    (project) => !project.equals(projectId)
  );
  project.members = project.members.filter((member) => !member.equals(userId));

  await projectMember.save();
  await project.save();

  res.status(204).end();
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
  acceptInvite,
  removeMember,
};
