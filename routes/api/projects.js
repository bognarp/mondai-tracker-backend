const express = require('express');
const router = express.Router();

// /api/projects

router.get('/test', (req, res) => {
  res.json({ msg: 'This is the projects route' });
});

module.exports = router;
