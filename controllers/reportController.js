/**
 * Report Controller
 * Handles report generation and analytics with MongoDB
 */

const Report = require('../models/Report');
const Bill = require('../models/Bill');

const generateReport = async (req, res) => {
  try {
    const { reportType, startDate, endDate, filters, shopId } = req.body;
    
    if (!reportType || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const query = { createdAt: { $gte: start, $lte: end } };
    if (shopId) query.shopId = shopId;

    const filteredBills = await Bill.find(query);

    const metrics = {
      totalBills: filteredBills.length,
      totalRevenue: 0,
      totalTax: 0,
      averageBillValue: 0,
      totalQuantitySold: 0,
      topSellingProducts: [],
      paymentBreakdown: {}
    };

    const productMap = {};

    filteredBills.forEach(bill => {
      metrics.totalRevenue += bill.totalAmount;
      metrics.totalTax += bill.taxAmount;
      
      bill.items.forEach(item => {
        metrics.totalQuantitySold += item.quantity;
        productMap[item._id] = (productMap[item._id] || 0) + item.quantity;
      });

      if (!metrics.paymentBreakdown[bill.paymentMethod]) {
        metrics.paymentBreakdown[bill.paymentMethod] = 0;
      }
      metrics.paymentBreakdown[bill.paymentMethod] += bill.totalAmount;
    });

    metrics.averageBillValue = metrics.totalBills > 0 ? metrics.totalRevenue / metrics.totalBills : 0;
    metrics.topSellingProducts = Object.entries(productMap)
      .map(([_id, quantity]) => ({ _id, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const newReport = new Report({
      reportType,
      reportName: `${reportType.replace(/_/g, ' ').toUpperCase()} Report`,
      shopId: shopId || "",
      dateRange: { startDate: start, endDate: end },
      filters: filters || {},
      metrics,
      status: "generated"
    });

    await newReport.save();
    res.status(201).json({ success: true, message: "Report generated successfully", data: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating report", error: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reports", error: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching report", error: error.message });
  }
};

const getDashboardMetrics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBills = await Bill.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const allBills = await Bill.find();

    const metrics = {
      todaySales: todayBills.reduce((sum, b) => sum + b.totalAmount, 0),
      todayBills: todayBills.length,
      totalRevenue: allBills.reduce((sum, b) => sum + b.totalAmount, 0),
      totalBills: allBills.length,
      averageBillValue: allBills.length > 0 ? allBills.reduce((sum, b) => sum + b.totalAmount, 0) / allBills.length : 0
    };

    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching metrics", error: error.message });
  }
};

module.exports = { generateReport, getAllReports, getReportById, getDashboardMetrics };
