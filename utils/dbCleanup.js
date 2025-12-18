/**
 * Database Cleanup Utility
 * Deletes all collections from MongoDB
 */

const Shop = require('../models/Shop');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Bill = require('../models/Bill');
const Report = require('../models/Report');
const User = require('../models/User');
const Supplier = require('../models/Supplier');

const cleanDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');

    await Shop.deleteMany({});
    console.log('✅ Shops cleared');

    await Category.deleteMany({});
    console.log('✅ Categories cleared');

    await Product.deleteMany({});
    console.log('✅ Products cleared');

    await Bill.deleteMany({});
    console.log('✅ Bills cleared');

    await Report.deleteMany({});
    console.log('✅ Reports cleared');

    await User.deleteMany({});
    console.log('✅ Users cleared');

    await Supplier.deleteMany({});
    console.log('✅ Suppliers cleared');

    console.log('🎉 Database cleanup completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error cleaning database:', error.message);
    return false;
  }
};

module.exports = { cleanDatabase };
