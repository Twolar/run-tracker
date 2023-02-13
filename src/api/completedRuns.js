const express = require('express');

const router = express.Router();

// Get all completed runs
router.get('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});

// Get single completed run based on ID

// Add new completed run

// Update existing completed run based on ID

// Delete existing completed run based on ID

module.exports = router;
