/**
 * Dashboard Controller
 * Handles dashboard statistics and recent data
 */

const Bill = require('../models/Bill');
const Product = require('../models/Product');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Bills created today
    const billsToday = await Bill.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
      isActive: true
    });

    // Total sales today
    const salesData = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalTax: { $sum: "$taxAmount" }
        }
      }
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;
    const totalTax = salesData.length > 0 ? salesData[0].totalTax : 0;

    // Active products (stock > 0)
    const activeBatches = await Product.countDocuments({
      'stock.current': { $gt: 0 },
      isActive: true
    });

    // Profit margin calculation
    // Assuming profit margin = (totalSales - totalCost) / totalSales * 100
    // For now, calculating as: (totalSales - totalTax) / totalSales * 100
    const profitMargin = totalSales > 0 
      ? (((totalSales - totalTax) / totalSales) * 100).toFixed(1)
      : 0;

    const stats = {
      billsToday,
      totalSales: totalSales.toFixed(2),
      activeBatches,
      profitMargin
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching dashboard stats", error: error.message });
  }
};

const getRecentBills = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentBills = await Bill.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('_id billNumber customerName totalAmount paymentStatus createdAt items');

    // Format the response
    const formattedBills = recentBills.map(bill => ({
      _id: bill._id,
      billNumber: bill.billNumber,
      customerName: bill.customerName || "Guest",
      totalAmount: bill.totalAmount,
      paymentStatus: bill.paymentStatus,
      itemCount: bill.items.length,
      createdAt: new Date(bill.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    res.status(200).json({ success: true, data: formattedBills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching recent bills", error: error.message });
  }
};

module.exports = { getDashboardStats, getRecentBills };
