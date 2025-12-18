const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryCode: { type: String, required: true, unique: true },
  categoryName: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  emoji: { type: String, default: "📦" },
  image: { type: String, default: "" },
  displayOrder: { type: Number, default: 0 },
  parentCategoryId: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
