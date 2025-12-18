const express = require('express');
const router = express.Router();
const { getAllSettings, getSetting, updateSetting } = require('../controllers/settingController');

router.get('/all', getAllSettings);
router.get('/:key', getSetting);
router.put('/:key', updateSetting);

module.exports = router;
