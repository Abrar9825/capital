const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billId: { type: String, unique: true, sparse: true },
  billNumber: { type: String, required: true, unique: true },
  shopId: { type: String, required: true },
  items: [{
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }, { _id: false }],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  gstRate: { type: Number, default: 18 },
  gstNumber: { type: String, default: "" },
  taxAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ["cash", "card", "upi", "cheque", "online", "credit"], 
    default: "cash" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "completed" 
  },
  customerName: { type: String, default: "" },
  customerPhone: { type: String, default: "" },
  notes: { type: String, default: "" },
  pdfUrl: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);
