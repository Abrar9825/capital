/**
 * Test Bill Creation with Stock Management
 * This script demonstrates the complete bill creation flow with stock deduction
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null) => {
  try {
    const config = { method, url: `${API_BASE}${endpoint}` };
    if (data) config.data = data;
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

const runTests = async () => {
  console.log('\n=== BILL CREATION WITH STOCK MANAGEMENT TEST ===\n');

  try {
    // Step 1: Create a product with stock
    console.log('Step 1: Creating product...');
    const productRes = await apiCall('POST', '/products/create', {
      productName: 'Laptop',
      categoryId: 'electronics',
      basePrice: 50000,
      discount: 10,
      gstRate: 18,
      stock: {
        current: 100,
        minimum: 10,
        maximum: 500,
        reserved: 0
      }
    });
    console.log('✅ Product created:', productRes.data);
    const productId = productRes.data._id;
    console.log(`Product ID (_id): ${productId}\n`);

    // Step 2: Check product stock before bill
    console.log('Step 2: Checking product stock before bill...');
    const productBefore = await apiCall('GET', `/products/${productId}`);
    console.log(`Stock before bill: ${productBefore.data.stock.current}\n`);

    // Step 3: Create a bill with the product
    console.log('Step 3: Creating bill...');
    const billRes = await apiCall('POST', '/bills/create', {
      shopId: 'shop-001',
      items: [
        {
          productId: productId,
          quantity: 5
        }
      ],
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      customerName: 'John Doe',
      customerPhone: '9876543210',
      discountAmount: 100,
      notes: 'Test bill'
    });
    console.log('✅ Bill created:', billRes.data);
    const billId = billRes.data.billId;
    console.log(`Bill ID: ${billId}\n`);

    // Step 4: Check product stock after bill
    console.log('Step 4: Checking product stock after bill...');
    const productAfter = await apiCall('GET', `/products/${productId}`);
    console.log(`Stock after bill: ${productAfter.data.stock.current}`);
    console.log(`Stock deducted: ${productBefore.data.stock.current - productAfter.data.stock.current}\n`);

    // Step 5: Update bill with new quantity
    console.log('Step 5: Updating bill with new quantity...');
    const updateRes = await apiCall('PUT', `/bills/update/${billId}`, {
      items: [
        {
          productId: productId,
          quantity: 8
        }
      ]
    });
    console.log('✅ Bill updated:', updateRes.data);

    // Step 6: Check stock after update
    console.log('Step 6: Checking product stock after bill update...');
    const productAfterUpdate = await apiCall('GET', `/products/${productId}`);
    console.log(`Stock after update: ${productAfterUpdate.data.stock.current}`);
    console.log(`Total stock deducted: ${productBefore.data.stock.current - productAfterUpdate.data.stock.current}\n`);

    // Step 7: Delete bill
    console.log('Step 7: Deleting bill...');
    const deleteRes = await apiCall('DELETE', `/bills/delete/${billId}`);
    console.log('✅ Bill deleted:', deleteRes.data);

    // Step 8: Check stock after delete
    console.log('Step 8: Checking product stock after bill deletion...');
    const productAfterDelete = await apiCall('GET', `/products/${productId}`);
    console.log(`Stock after deletion: ${productAfterDelete.data.stock.current}`);
    console.log(`Stock restored: ${productAfterDelete.data.stock.current === productBefore.data.stock.current ? 'YES ✅' : 'NO ❌'}\n`);

    console.log('=== ALL TESTS COMPLETED SUCCESSFULLY ===\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
};

// Run the tests
runTests();
