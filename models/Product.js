const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true, sparse: true },
  productName: { type: String, required: true },
  categoryId: { type: String, required: true },
  basePrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gstRate: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  stock: {
    current: { type: Number, default: 0 },
    minimum: { type: Number, default: 0 },
    maximum: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
