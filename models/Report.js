const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportType: { type: String, required: true },
  reportName: { type: String, required: true },
  shopId: { type: String, default: "" },
  dateRange: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  filters: { type: mongoose.Schema.Types.Mixed, default: {} },
  metrics: {
    totalBills: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    averageBillValue: { type: Number, default: 0 },
    totalQuantitySold: { type: Number, default: 0 },
    topSellingProducts: [{ type: mongoose.Schema.Types.Mixed }],
    paymentBreakdown: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  status: { type: String, default: "generated" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
