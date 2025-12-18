const Setting = require('../models/Setting');

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching settings', error: error.message });
  }
};

// Get a single setting by key
exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    if (!setting) return res.status(404).json({ success: false, message: 'Setting not found' });
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching setting', error: error.message });
  }
};

// Update or create a setting
exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating setting', error: error.message });
  }
};
