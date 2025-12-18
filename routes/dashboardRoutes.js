/**
 * Dashboard Routes
 */
const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentBills } = require('../controllers/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/recent-bills', getRecentBills);

module.exports = router;
