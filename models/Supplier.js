const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  shopId: { type: String, required: true },
  supplierName: { type: String, required: true },
  email: { type: String, default: "" },
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  gstin: { type: String, default: "" },
  bankDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);
