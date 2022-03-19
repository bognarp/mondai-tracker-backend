const Story = require('../models/Story');
const AppError = require('../utils/appError');

// ALIAS MIDDLEWARE
const currentAlias = (req, res, next) => {
  req.query.state = 'UNSTARTED,STARTED,RESTARTED,FINISHED,REJECTED';
  next();
};

const backlogAlias = (req, res, next) => {
  req.query.state = 'UNSCHEDULED';
  next();
};

const archiveAlias = (req, res, next) => {
  req.query.state = 'ACCEPTED';
  next();
};

// CRUD
const getStories = async (req, res) => {
  const { projectId } = req.params;
  const customQueryParams = ['state', 'sort'];
  const queryObj = { ...req.query, project: projectId };

  // FIXME: getting current/archive/backlog should be possible
  // only when user is (projectOwner || projectMember)

  customQueryParams.forEach((param) => {
    delete queryObj[param];
  });

  let query = Story.find(queryObj);

  if (req.query.state) {
    const states = req.query.state.split(',');
    query = query.where('state').in(states);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-priority difficulty');
  }

  const stories = await query
    .populate({ path: 'requester', select: 'username' })
    .populate({ path: 'owner', select: 'username' })
    .exec();

  res.json(stories);
};

const createStory = async (req, res) => {
  // TODO: validations (title, description, state, diff, prio)

  // FIXME: user can only create stories if member || owner

  const { projectId } = req.params;
  const user = req.user;

  const story = new Story({
    title: req.body.title,
    description: req.body.description,
    state: req.body.state,
    owner: req.body.owner,
    difficulty: req.body.difficulty,
    priority: req.body.priority,
    requester: user._id,
    project: projectId,
  });

  const savedStory = await story.save();

  const populatedStory = await Story.findById(savedStory._id)
    .populate({ path: 'requester', select: 'username' })
    .populate({ path: 'owner', select: 'username' })
    .exec();

  res.status(201).json(populatedStory);
};

const updateStory = async (req, res) => {
  const { projectId, storyId } = req.params;
  const user = req.user;
  const body = req.body;

  const story = await Story.findOne({
    project: projectId,
    _id: storyId,
  }).exec();

  if (!story) throw new AppError('Story not found', 404);
  if (!user.isProjectOwner(projectId) && !user.isProjectMember(projectId)) {
    throw new AppError('Forbidden', 403);
  }

  Object.keys(body).forEach((key) => {
    story[key] = body[key];
  });

  const updatedStory = await story.save();

  const populatedStory = await Story.findById(updatedStory._id)
    .populate({ path: 'requester', select: 'username' })
    .populate({ path: 'owner', select: 'username' })
    .exec();

  res.json(populatedStory);
};

const removeStory = async (req, res) => {
  const { projectId, storyId } = req.params;
  const user = req.user;

  const story = await Story.findById(storyId).exec();

  if (!story) throw new AppError('Story not found', 404);
  if (!user.isProjectOwner(projectId) && !user.isProjectMember(projectId)) {
    throw new AppError('Forbidden', 403);
  }

  await Story.deleteById(story._id);

  res.status(204).end();
};

module.exports = {
  currentAlias,
  backlogAlias,
  archiveAlias,
  getStories,
  createStory,
  updateStory,
  removeStory,
};
