const express = require('express');

const completedRuns = require('./completedRuns'); 

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/completedRuns', completedRuns);

module.exports = router;
