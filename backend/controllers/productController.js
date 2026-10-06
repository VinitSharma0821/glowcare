const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc Get all products with filters, search, pagination, and sorting
// @route GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      skinType,
      concern,
      routineStep,
      minPrice,
      maxPrice,
      minRating,
      sort,
      isFeatured,
      isBestSeller,
      isNewArrival,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Keyword search
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { name: regex },
        { subtitle: regex },
        { shortDescription: regex },
        { description: regex },
        { categoryName: regex },
        { fullIngredients: regex },
        { 'keyIngredients.name': regex }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      const catObj = await Category.findOne({ slug: category });
      if (catObj) {
        query.category = catObj._id;
      } else {
        query.categoryName = new RegExp(category, 'i');
      }
    }

    // Skin type filter
    if (skinType && skinType !== 'all') {
      query.skinTypes = { $in: [skinType, 'All Skin Types'] };
    }

    // Skin concern filter
    if (concern && concern !== 'all') {
      query.concerns = { $in: [new RegExp(concern, 'i')] };
    }

    // Routine step filter
    if (routineStep && routineStep !== 'all') {
      query.routineStep = routineStep;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Badges / Flags
    if (isFeatured === 'true') query.isFeatured = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1, numReviews: -1 };
    else if (sort === 'bestseller') sortOption = { isBestSeller: -1, rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'name-asc') sortOption = { name: 1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single product by slug or id
// @route GET /api/products/:identifier
exports.getProductByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug description');
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug description');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get featured, best sellers, and new arrivals for homepage
// @route GET /api/products/home/highlights
exports.getHomeHighlights = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(8);
    const bestSellers = await Product.find({ isBestSeller: true }).limit(8);
    const newArrivals = await Product.find({ isNewArrival: true }).limit(8);

    res.json({
      success: true,
      featured,
      bestSellers,
      newArrivals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Recommend routine based on skin type and primary concern
// @route GET /api/products/routine-finder
exports.getRoutineRecommendation = async (req, res) => {
  try {
    const { skinType, concern } = req.query;

    if (!skinType) {
      return res.status(400).json({ success: false, message: 'Please specify skinType' });
    }

    const skinFilter = { skinTypes: { $in: [skinType, 'All Skin Types'] } };

    // Steps: Cleanse, Tone, Treat, Moisturize, Protect
    const cleanser = await Product.findOne({
      ...skinFilter,
      routineStep: 'Cleanse'
    });

    const toner = await Product.findOne({
      ...skinFilter,
      routineStep: 'Tone'
    });

    const serum = await Product.findOne({
      ...skinFilter,
      routineStep: 'Treat',
      ...(concern ? { concerns: { $in: [new RegExp(concern, 'i')] } } : {})
    }) || await Product.findOne({ ...skinFilter, routineStep: 'Treat' });

    const moisturizer = await Product.findOne({
      ...skinFilter,
      routineStep: 'Moisturize'
    });

    const sunscreen = await Product.findOne({
      routineStep: 'Protect'
    });

    const routine = [
      { step: 1, title: 'Cleanse', subtitle: 'Purify & Refresh', product: cleanser },
      { step: 2, title: 'Tone', subtitle: 'Balance pH & Hydrate', product: toner },
      { step: 3, title: 'Treat', subtitle: 'Targeted Active Serum', product: serum },
      { step: 4, title: 'Moisturize', subtitle: 'Lock In Barrier Hydration', product: moisturizer },
      { step: 5, title: 'Protect', subtitle: 'Daily Broad-Spectrum SPF', product: sunscreen }
    ].filter(item => item.product !== null);

    const bundlePrice = routine.reduce((acc, item) => acc + (item.product ? item.product.price : 0), 0);
    const discountedPrice = Math.round(bundlePrice * 0.85); // 15% routine bundle discount

    res.json({
      success: true,
      skinType,
      concern: concern || 'Overall Radiance',
      routine,
      bundlePrice,
      discountedPrice,
      savings: bundlePrice - discountedPrice
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a new review
// @route POST /api/products/:id/reviews
exports.createProductReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      userSkinType: req.user.skinType || 'Combination',
      rating: Number(rating),
      title: title || 'Great product!',
      comment,
      verifiedPurchase: true
    });

    // Recalculate average rating
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating = Number((allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1));
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get reviews for a product
// @route GET /api/products/:id/reviews
exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
    });

    res.json({
      success: true,
      reviews,
      count: reviews.length,
      ratingCounts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Create a product
// @route POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      subtitle,
      category,
      categoryName,
      price,
      compareAtPrice,
      stock,
      sku,
      shortDescription,
      description,
      images,
      thumbnail,
      volume,
      skinTypes,
      concerns,
      routineStep,
      keyIngredients,
      fullIngredients,
      howToUse,
      benefits,
      texture,
      scent,
      isFeatured,
      isBestSeller,
      isNewArrival
    } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await Product.create({
      name,
      slug,
      subtitle,
      category,
      categoryName,
      price: Number(price),
      compareAtPrice: Number(compareAtPrice || 0),
      stock: Number(stock || 50),
      sku: sku || `GC-${Math.floor(1000 + Math.random() * 9000)}`,
      shortDescription,
      description,
      images: images && images.length ? images : [thumbnail],
      thumbnail,
      volume: volume || '50ml',
      skinTypes: skinTypes || ['All Skin Types'],
      concerns: concerns || [],
      routineStep: routineStep || 'Treat',
      keyIngredients: keyIngredients || [],
      fullIngredients: fullIngredients || '',
      howToUse: howToUse || [],
      benefits: benefits || [],
      texture: texture || 'Smooth Cream',
      scent: scent || 'Subtle botanical',
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival)
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update product
// @route PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Delete product
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    await Review.deleteMany({ product: req.params.id });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
