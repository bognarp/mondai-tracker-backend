const express = require('express');
const router = express.Router({ mergeParams: true });

const storyController = require('../../controllers/storyController');

// /:projectId/stories

router
  .route('/')
  .get(storyController.getStories)
  .post(storyController.createStory);
router
  .route('/:storyId')
  .patch(storyController.updateStory)
  .delete(storyController.removeStory);

router
  .route('/current')
  .get(storyController.currentAlias, storyController.getStories);
router
  .route('/backlog')
  .get(storyController.backlogAlias, storyController.getStories);
router
  .route('/archive')
  .get(storyController.archiveAlias, storyController.getStories);

module.exports = router;
