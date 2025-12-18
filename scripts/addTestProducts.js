const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('../models/Product');
const Category = require('../models/Category');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Add 30 test products
const addTestProducts = async () => {
    try {
        console.log('🚀 Starting to add 30 test products...');
        
        // Get or create a category
        let category = await Category.findOne().sort({ createdAt: -1 });
        
        if (!category) {
            // No categories exist, create one
            const uniqueCode = 'TEST_' + Date.now();
            category = await Category.create({
                categoryCode: uniqueCode,
                categoryName: 'Updated Category',
                description: 'Test category for multi-bill testing',
                emoji: '🎁',
                isActive: true
            });
            console.log(`📁 Created new category: ${category.categoryName} (ID: ${category._id})`);
        } else {
            console.log(`📁 Using existing category: ${category.categoryName} (ID: ${category._id})`);
        }
        
        const testProducts = [];
        const basePrice = 500;
        
        // Create 30 products
        for (let i = 1; i <= 30; i++) {
            const product = {
                productName: `Test Product ${i}`,
                categoryId: category._id.toString(),
                basePrice: basePrice + (i * 50),
                finalPrice: basePrice + (i * 50),
                description: `Test product ${i} for multi-bill testing`,
                stock: {
                    current: 100 + (i * 5),
                    minimum: 10
                },
                gstRate: 18,
                isActive: true
            };
            testProducts.push(product);
        }
        
        // Insert all products
        const insertedProducts = await Product.insertMany(testProducts);
        console.log(`✅ Successfully added ${insertedProducts.length} products!`);
        
        // Display summary
        console.log('\n📊 Product Summary:');
        console.log(`Category: Updated Category`);
        console.log(`Total Products: ${insertedProducts.length}`);
        console.log(`Price Range: ₹${basePrice + 50} - ₹${basePrice + (30 * 50)}`);
        console.log(`Stock Range: 105 - ${100 + (30 * 5)} pieces`);
        
        console.log('\n📝 Products Added:');
        insertedProducts.forEach((prod, idx) => {
            console.log(`${idx + 1}. ${prod.productName} - ₹${prod.finalPrice} (Stock: ${prod.stock.current})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding products:', error.message);
        process.exit(1);
    }
};

// Run script
connectDB().then(() => {
    addTestProducts();
});
