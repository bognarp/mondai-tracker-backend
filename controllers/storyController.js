const Story = require('../models/Story');

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

const getAllStories = (req, res, next) => {
  const { projectId } = req.params;
  const filter = _stateFilter(req.path);

  Story.find({ projectId, state: filter })
    .then((stories) => {
      res.json(stories);
    })
    .catch((err) => {
      next(err);
    });
};

const createStory = (req, res, next) => {
  // TODO: validations
  const { projectId } = req.params;
  const user = req.user;
  let state;

  if (req.path === '/current') state = 'UNSTARTED';
  if (req.path === '/backlog') state = 'UNSCHEDULED';

  const newStory = new Story({
    title: req.body.title,
    description: req.body.description,
    state,
    requester: user._id,
    project: projectId,
  });

  newStory
    .save()
    .then((story) => {
      res.status(201).json(story);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getAllStories,
  createStory,
};
