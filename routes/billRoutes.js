/**
 * Bill Routes
 */
const express = require('express');
const router = express.Router();
const { createBill, getAllBills, getBillById, getBillByNumber, getBillsByShop, updateBill, deleteBill, uploadPdfToGitHub } = require('../controllers/billController');

router.post('/create', createBill);
router.get('/all', getAllBills);
router.get('/number/:billNumber', getBillByNumber);
router.get('/shop/:shopId', getBillsByShop);
router.post('/store-github-pdf', uploadPdfToGitHub);
router.get('/:billId', getBillById);
router.put('/update/:billId', updateBill);
router.delete('/delete/:billId', deleteBill);

module.exports = router;