const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc Get all categories with product count
// @route GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });

    // Attach product count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          productCount
        };
      })
    );

    res.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get category by slug
// @route GET /api/categories/:slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const productCount = await Product.countDocuments({ category: category._id });
    res.json({ success: true, category: { ...category.toObject(), productCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Create category
// @route POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, icon, displayOrder } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      icon: icon || 'Sparkles',
      displayOrder: displayOrder || 0
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update category
// @route PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.image = req.body.image !== undefined ? req.body.image : category.image;
    category.icon = req.body.icon || category.icon;
    category.displayOrder = req.body.displayOrder !== undefined ? req.body.displayOrder : category.displayOrder;

    if (req.body.name) {
      category.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const updated = await category.save();
    res.json({ success: true, category: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete category
// @route DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const productsUnderCategory = await Product.countDocuments({ category: category._id });
    if (productsUnderCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${productsUnderCategory} products are assigned to it.`
      });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
