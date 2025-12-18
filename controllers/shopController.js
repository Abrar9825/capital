/**
 * Shop Controller
 * Handles shop/business CRUD operations with MongoDB
 */

const Shop = require('../models/Shop');

const createShop = async (req, res) => {
  try {
    const { shopName, ownerName, email, phone, address, city, state, gstNumber, gstRate } = req.body;
    
    if (!shopName || !ownerName || !email || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingShop = await Shop.findOne({ $or: [{ email }, { shopName }] });
    if (existingShop) {
      return res.status(400).json({ success: false, message: "Shop with this email or name already exists" });
    }

    const newShop = new Shop({
      shopName,
      ownerName,
      email,
      phone,
      address: address || "",
      city: city || "",
      state: state || "",
      gstNumber: gstNumber || "",
      gstRate: gstRate || 18,
      invoicePrefix: `INV-${Date.now().toString().slice(-6)}`,
      isActive: true
    });

    await newShop.save();
    res.status(201).json({ success: true, message: "Shop created successfully", data: newShop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating shop", error: error.message });
  }
};

const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ isActive: true });
    if (!shop) {
      return res.status(404).json({ success: false, message: "No active shop found" });
    }
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching shop", error: error.message });
  }
};

const getShopById = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching shop", error: error.message });
  }
};

const updateShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { shopName, ownerName, email, phone, address, city, state, gstNumber, gstRate } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    if (email && email !== shop.email) {
      const existingEmail = await Shop.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
    }

    if (shopName) shop.shopName = shopName;
    if (ownerName) shop.ownerName = ownerName;
    if (email) shop.email = email;
    if (phone) shop.phone = phone;
    if (address !== undefined) shop.address = address;
    if (city !== undefined) shop.city = city;
    if (state !== undefined) shop.state = state;
    if (gstNumber !== undefined) shop.gstNumber = gstNumber;
    if (gstRate !== undefined) shop.gstRate = gstRate;
    
    shop.updatedAt = new Date();
    await shop.save();

    res.status(200).json({ success: true, message: "Shop updated successfully", data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating shop", error: error.message });
  }
};

const deleteShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findOne({ shopId });
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }
    
    shop.isActive = false;
    shop.updatedAt = new Date();
    await shop.save();

    res.status(200).json({ success: true, message: "Shop deleted successfully", data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting shop", error: error.message });
  }
};

module.exports = { createShop, getMyShop, getShopById, updateShop, deleteShop };
