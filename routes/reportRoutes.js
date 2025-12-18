/**
 * Report Routes
 */
const express = require('express');
const router = express.Router();
const { generateReport, getAllReports, getReportById, getDashboardMetrics } = require('../controllers/reportController');

router.post('/generate', generateReport);
router.get('/all', getAllReports);
router.get('/metrics', getDashboardMetrics);
router.get('/:reportId', getReportById);

module.exports = router;
