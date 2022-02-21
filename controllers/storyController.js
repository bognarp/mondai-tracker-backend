const Story = require('../models/Story');
const AppError = require('../utils/appError');

const _stateFilter = (path) => {
  switch (path) {
    case '/current':
      return ['UNSTARTED', 'STARTED', 'RESTARTED', 'FINISHED', 'REJECTED'];
    case '/backlog':
      return ['UNSCHEDULED'];
    case '/archive':
      return ['ACCEPTED'];
    default:
      break;
  }
};

const getAllStories = async (req, res) => {
  // TODO: getting current/archive/backlog should be possible
  // only when user is (projectOwner || projectMember)
  const { projectId } = req.params;
  const filter = _stateFilter(req.path);

  const stories = await Story.find({
    project: projectId,
    state: filter,
  }).exec();

  res.json(stories);
};

const getCurrentStoriesByUser = async (req, res) => {
  const { projectId, userId } = req.params;

  const stories = await Story.find({
    project: projectId,
    owner: userId,
  }).exec();

  res.json(stories);
};

const createStory = async (req, res) => {
  // TODO: validations
  // title -> required, no duplicates
  // difficulty ->
  // priority ->
  const { projectId } = req.params;
  const user = req.user;
  let state;

  if (req.path === '/current') state = 'UNSTARTED';
  if (req.path === '/backlog') state = 'UNSCHEDULED';

  const story = new Story({
    title: req.body.title,
    description: req.body.description,
    state,
    requester: user._id,
    project: projectId,
  });

  const savedStory = await story.save();

  res.status(201).json(savedStory);
};

const updateStory = async (req, res) => {
  const { projectId, storyId } = req.params;
  const user = req.user;
  const body = req.body;

  const story = await Story.findById(storyId).exec();
  
  if (!story) throw new AppError('Story not found', 404);
  if (!user.isProjectOwner(projectId) && !user.isProjectMember(projectId)) {
    throw new AppError('Forbidden', 403);
  }

  Object.keys(body).forEach((key) => {
    story[key] = body[key];
  });

  const updatedStory = await story.save();

  res.json(updatedStory);
};

module.exports = {
  getAllStories,
  getCurrentStoriesByUser,
  createStory,
  updateStory,
};
