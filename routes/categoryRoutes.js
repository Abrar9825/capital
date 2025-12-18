/**
 * Category Routes
 */
const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.post('/create', createCategory);
router.get('/all', getAllCategories);
router.get('/:categoryId', getCategoryById);
router.put('/update/:categoryId', updateCategory);
router.delete('/delete/:categoryId', deleteCategory);

module.exports = router;
