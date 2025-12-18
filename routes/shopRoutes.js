/**
 * Shop Routes
 */
const express = require('express');
const router = express.Router();
const { createShop, getMyShop, getShopById, updateShop, deleteShop } = require('../controllers/shopController');

router.post('/create', createShop);
router.get('/my-shop', getMyShop);
router.get('/:shopId', getShopById);
router.put('/update/:shopId', updateShop);
router.delete('/delete/:shopId', deleteShop);

module.exports = router;
