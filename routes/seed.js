// Seed endpoint - call via browser to populate database
const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/seed-now', async (req, res) => {
  try {
    // Run seed script
    require('../scripts/seed');
    
    res.json({
      success: true,
      message: 'Database is being seeded. Check server logs for confirmation.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
