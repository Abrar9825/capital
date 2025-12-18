/**
 * Product Controller
 * Handles product CRUD operations with MongoDB
 */

const Product = require('../models/Product');

const calculateFinalPrice = (basePrice, discount = 0, gstRate = 0) => {
  const discountAmount = (basePrice * discount) / 100;
  const priceAfterDiscount = basePrice - discountAmount;
  const gstAmount = (priceAfterDiscount * gstRate) / 100;
  return priceAfterDiscount + gstAmount;
};

const createProduct = async (req, res) => {
  try {
    const { productName, categoryId, basePrice, discount, gstRate, image, stock, finalPrice } = req.body;
    
    if (!productName || !categoryId || !basePrice) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const calculatedFinalPrice = finalPrice || calculateFinalPrice(basePrice, discount || 0, gstRate || 0);
    const defaultStock = { current: 0, minimum: 0, maximum: 0, reserved: 0 };
    
    // Generate productId
    const count = await Product.countDocuments();
    const productId = `PRD-${count + 1}`;

    const newProduct = new Product({
      productId,
      productName,
      categoryId,
      basePrice,
      discount: discount || 0,
      gstRate: gstRate || 0,
      finalPrice: calculatedFinalPrice,
      image: image || "",
      stock: stock ? { ...defaultStock, ...stock } : defaultStock,
      isActive: true
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product created successfully", data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating product", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ isActive: true });
    res.status(200).json({ success: true, data: activeProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryProducts = await Product.find({ categoryId, isActive: true });
    res.status(200).json({ success: true, data: categoryProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    let product = null;
    if (/^[a-f\d]{24}$/i.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, categoryId, basePrice, discount, gstRate, image, stock } = req.body;

    let product = null;
    if (/^[a-f\d]{24}$/i.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (productName) product.productName = productName;
    if (categoryId) product.categoryId = categoryId;
    if (basePrice !== undefined) product.basePrice = basePrice;
    if (discount !== undefined) product.discount = discount;
    if (gstRate !== undefined) product.gstRate = gstRate;
    if (image !== undefined) product.image = image;
    if (stock) product.stock = { ...product.stock, ...stock };
    
    product.finalPrice = calculateFinalPrice(product.basePrice, product.discount, product.gstRate);
    product.updatedAt = new Date();
    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    let product = null;
    if (/^[a-f\d]{24}$/i.test(productId)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    product.isActive = false;
    product.updatedAt = new Date();
    await product.save();

    res.status(200).json({ success: true, message: "Product deleted successfully", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product", error: error.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductsByCategory, getProductById, updateProduct, deleteProduct };
