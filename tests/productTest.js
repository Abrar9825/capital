/**
 * Product API Test Script
 * Tests all product operations with MongoDB _id
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

const apiCall = async (method, endpoint, data = null) => {
  try {
    const config = { method, url: `${API_BASE}${endpoint}` };
    if (data) config.data = data;
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

const runTests = async () => {
  console.log('\n=== PRODUCT API TESTS ===\n');

  try {
    // Test 1: Create Product
    console.log('Test 1: Creating product...');
    const createRes = await apiCall('POST', '/products/create', {
      productName: 'iPhone 15',
      categoryId: 'electronics',
      basePrice: 80000,
      discount: 5,
      gstRate: 18,
      image: 'iphone15.jpg',
      stock: {
        current: 50,
        minimum: 5,
        maximum: 200,
        reserved: 0
      }
    });
    console.log('✅ Product created');
    const productId = createRes.data._id;
    console.log(`  - Product Name: ${createRes.data.productName}`);
    console.log(`  - MongoDB _id: ${productId}`);
    console.log(`  - Final Price: ${createRes.data.finalPrice}`);
    console.log(`  - Stock: ${createRes.data.stock.current}\n`);

    // Test 2: Get All Products
    console.log('Test 2: Getting all products...');
    const allRes = await apiCall('GET', '/products/all');
    console.log(`✅ Found ${allRes.data.length} products\n`);

    // Test 3: Get Product By ID
    console.log(`Test 3: Getting product by _id: ${productId}`);
    const getRes = await apiCall('GET', `/products/${productId}`);
    console.log('✅ Product fetched');
    console.log(`  - Name: ${getRes.data.productName}`);
    console.log(`  - Stock: ${getRes.data.stock.current}\n`);

    // Test 4: Get Products By Category
    console.log('Test 4: Getting products by category: electronics');
    const catRes = await apiCall('GET', '/products/category/electronics');
    console.log(`✅ Found ${catRes.data.length} products in category\n`);

    // Test 5: Update Product
    console.log(`Test 5: Updating product (stock update)...`);
    const updateRes = await apiCall('PUT', `/products/update/${productId}`, {
      stock: {
        current: 45,
        minimum: 5,
        maximum: 200,
        reserved: 0
      }
    });
    console.log('✅ Product updated');
    console.log(`  - Stock updated to: ${updateRes.data.stock.current}\n`);

    // Test 6: Delete Product (soft delete)
    console.log(`Test 6: Deleting product...`);
    const deleteRes = await apiCall('DELETE', `/products/delete/${productId}`);
    console.log('✅ Product deleted (soft delete)');
    console.log(`  - isActive: ${deleteRes.data.isActive}\n`);

    console.log('=== ALL PRODUCT TESTS COMPLETED ===\n');

  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
  }
};

runTests();
