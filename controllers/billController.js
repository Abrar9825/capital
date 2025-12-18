/**
 * Bill Controller
 * Handles bill creation and management with MongoDB
 */

const Bill = require('../models/Bill');
const Product = require('../models/Product');

const createBill = async (req, res) => {
  try {
    const { shopId, items, subtotal, taxAmount, totalAmount, paymentMethod, paymentStatus, customerName, customerPhone, notes, discountAmount } = req.body;

    console.log('📥 Bill Create Request:', { shopId, itemsCount: items?.length, subtotal, taxAmount, totalAmount });

    if (!shopId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let calculatedSubtotal = 0;
    let calculatedTaxAmount = 0;
    const processedItems = [];

    for (const item of items) {
      // Support both productId and _id fields
      const productId = item.productId || item._id;
      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID or _id is required in items" });
      }
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${productId} not found` });
      }

      // Check if sufficient stock available
      if (product.stock.current < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.productName}. Available: ${product.stock.current}, Requested: ${item.quantity}` });
      }

      const itemTotal = product.finalPrice * item.quantity;
      calculatedSubtotal += itemTotal;
      calculatedTaxAmount += (itemTotal * (product.gstRate || 0)) / 100;

      processedItems.push({
        _id: product._id,
        productName: product.productName,
        quantity: item.quantity,
        basePrice: product.basePrice,
        finalPrice: product.finalPrice,
        totalPrice: itemTotal
      });
    }

    // Use provided amounts or calculated amounts
    const finalSubtotal = subtotal || calculatedSubtotal;
    const finalTaxAmount = taxAmount || calculatedTaxAmount;
    const finalTotalAmount = totalAmount || (finalSubtotal + finalTaxAmount - (discountAmount || 0));
    
    // Generate billId
    const billCount = await Bill.countDocuments();
    const billId = `BIL-${billCount + 1}`;
    const billNumber = `BILL-${Date.now()}`; // Use timestamp for unique bill number

    const newBill = new Bill({
      billId,
      billNumber,
      shopId,
      items: processedItems,
      subtotal: finalSubtotal,
      discountAmount: discountAmount || 0,
      taxAmount: finalTaxAmount,
      totalAmount: finalTotalAmount,
      paymentMethod: paymentMethod || "cash",
      paymentStatus: paymentStatus || "completed",
      customerName: customerName || "",
      customerPhone: customerPhone || "",
      notes: notes || "",
      isActive: true
    });

    console.log('💾 Saving Bill:', { billId, billNumber: newBill.billNumber });
    await newBill.save();
    console.log('✅ Bill saved successfully');

    res.status(201).json({ success: true, message: "Bill created successfully", data: newBill });
  } catch (error) {
    console.error('❌ Bill Creation Error:', error);
    res.status(500).json({ success: false, message: "Error creating bill", error: error.message });
  }
};

const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bills", error: error.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bill", error: error.message });
  }
};

const getBillByNumber = async (req, res) => {
  try {
    const { billNumber } = req.params;
    const bill = await Bill.findOne({ billNumber, isActive: true });
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bill", error: error.message });
  }
};

const getBillsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const bills = await Bill.find({ shopId, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bills", error: error.message });
  }
};

const updateBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const { paymentStatus, paymentMethod, notes, items } = req.body;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    // If items are being updated, recalculate stock
    if (items && items.length > 0) {
      // Restore original stock from old bill items
      for (const oldItem of bill.items) {
        await Product.findByIdAndUpdate(
          oldItem._id,
          { $inc: { 'stock.current': oldItem.quantity } },
          { new: true }
        );
      }

      // Process new items and deduct stock
      let subtotal = 0;
      let taxAmount = 0;
      const processedItems = [];

      for (const item of items) {
        // Support both productId and _id fields
        const productId = item.productId || item._id;
        if (!productId) {
          return res.status(400).json({ success: false, message: "Product ID or _id is required in items" });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product ${productId} not found` });
        }

        // Check if sufficient stock available
        if (product.stock.current < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.productName}. Available: ${product.stock.current}, Requested: ${item.quantity}` });
        }

        const itemTotal = product.finalPrice * item.quantity;
        subtotal += itemTotal;
        taxAmount += (itemTotal * (product.gstRate || 0)) / 100;

        processedItems.push({
          _id: product._id,
          productName: product.productName,
          quantity: item.quantity,
          basePrice: product.basePrice,
          finalPrice: product.finalPrice,
          totalPrice: itemTotal
        });
      }

      bill.items = processedItems;
      bill.subtotal = subtotal;
      bill.taxAmount = taxAmount;
      bill.totalAmount = subtotal + taxAmount - (bill.discountAmount || 0);

      // Deduct new stock
      for (const item of processedItems) {
        await Product.findByIdAndUpdate(
          item._id,
          { $inc: { 'stock.current': -item.quantity } },
          { new: true }
        );
      }
    }

    if (paymentStatus) bill.paymentStatus = paymentStatus;
    if (paymentMethod) bill.paymentMethod = paymentMethod;
    if (notes !== undefined) bill.notes = notes;

    bill.updatedAt = new Date();
    await bill.save();

    res.status(200).json({ success: true, message: "Bill updated successfully", data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating bill", error: error.message });
  }
};

const deleteBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    // Restore stock when bill is deleted
    for (const item of bill.items) {
      await Product.findByIdAndUpdate(
        item._id,
        { $inc: { 'stock.current': item.quantity } },
        { new: true }
      );
    }

    bill.isActive = false;
    bill.updatedAt = new Date();
    await bill.save();

    res.status(200).json({ success: true, message: "Bill deleted successfully", data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting bill", error: error.message });
  }
};

const uploadPdfToGitHub = async (req, res) => {
  try {
    const { billNumber, pdfContent } = req.body;

    if (!billNumber || !pdfContent) {
      return res.status(400).json({ success: false, message: "Missing billNumber or PDF content" });
    }

    const { Octokit } = require("@octokit/rest");
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const fileName = `${billNumber}.pdf`;
    const path = `bills/${fileName}`;

    try {
      // Try to get existing file
      const existing = await octokit.rest.repos.getContent({
        owner,
        repo,
        path
      });

      // Update if exists
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Update bill ${billNumber}`,
        content: pdfContent,
        sha: existing.data.sha
      });
    } catch (error) {
      // Create if doesn't exist
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `Upload bill ${billNumber}`,
        content: pdfContent
      });
    }

    // Generate GitHub raw content URL
    const pdfUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;

    res.status(200).json({ 
      success: true, 
      message: "PDF uploaded to GitHub", 
      pdfUrl,
      fileName
    });
  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    res.status(500).json({ success: false, message: "Error uploading PDF", error: error.message });
  }
};

module.exports = { createBill, getAllBills, getBillById, getBillByNumber, getBillsByShop, updateBill, deleteBill, uploadPdfToGitHub };
