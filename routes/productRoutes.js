/**
 * Product Routes
 */
const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductsByCategory, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

router.post('/create', createProduct);
router.get('/all', getAllProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:productId', getProductById);
router.put('/update/:productId', updateProduct);
router.delete('/delete/:productId', deleteProduct);

module.exports = router;
