const express = require('express');
const router = express.Router({ mergeParams: true });

const storyController = require('../../controllers/storyController');

// /:projectId/stories

router.route('/:storyId').patch(storyController.updateStory);
router
  .route('/current')
  .get(storyController.getAllStories)
  .post(storyController.createStory);
router
  .route('/backlog')
  .get(storyController.getAllStories)
  .post(storyController.createStory);
router.route('/archive').get(storyController.getAllStories);
router.route('/user/:userId').get(storyController.getCurrentStoriesByUser);

// TODO:
//    /stories/current .post().get().delete().patch()
//    /stories/backlog .post().get().delete().patch()
//    /stories/archive .get()

module.exports = router;
