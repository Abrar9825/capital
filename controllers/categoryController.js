/**
 * Category Controller
 * Handles category CRUD operations with MongoDB
 */

const Category = require('../models/Category');

const createCategory = async (req, res) => {
  try {
    const { categoryName, description, emoji, image, displayOrder } = req.body;
    
    if (!categoryName) {
      return res.status(400).json({ success: false, message: "Missing categoryName" });
    }

    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const count = await Category.countDocuments();
    const newCategory = new Category({
      categoryCode: `CAT-${count + 1}`,
      categoryName,
      description: description || "",
      emoji: emoji || "📦",
      image: image || "",
      displayOrder: displayOrder || count,
      isActive: true
    });

    await newCategory.save();
    res.status(201).json({ success: true, message: "Category created successfully", data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating category", error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const activeCategories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(200).json({ success: true, data: activeCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, description, emoji, image, displayOrder } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (categoryName && categoryName !== category.categoryName) {
      const existing = await Category.findOne({ categoryName });
      if (existing) {
        return res.status(400).json({ success: false, message: "Name already exists" });
      }
    }

    if (categoryName) category.categoryName = categoryName;
    if (description !== undefined) category.description = description;
    if (emoji !== undefined) category.emoji = emoji;
    if (image !== undefined) category.image = image;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    
    category.updatedAt = new Date();
    await category.save();

    res.status(200).json({ success: true, message: "Category updated successfully", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    
    category.isActive = false;
    category.updatedAt = new Date();
    await category.save();

    res.status(200).json({ success: true, message: "Category deleted successfully", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting category", error: error.message });
  }
};

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
