/**
 * Admin Routes
 * Utility endpoints for database management
 */

const express = require('express');
const router = express.Router();
const { cleanDatabase } = require('../utils/dbCleanup');

router.post('/cleanup-db', async (req, res) => {
  try {
    const success = await cleanDatabase();
    if (success) {
      res.status(200).json({ 
        success: true, 
        message: "✅ Database cleaned successfully. All collections are now empty." 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "❌ Error during database cleanup" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error during cleanup", 
      error: error.message 
    });
  }
});

module.exports = router;
