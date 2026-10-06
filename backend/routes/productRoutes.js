const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdOrSlug,
  getHomeHighlights,
  getRoutineRecommendation,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/home/highlights', getHomeHighlights);
router.get('/routine-finder', getRoutineRecommendation);
router.get('/:identifier', getProductByIdOrSlug);

router.post('/:id/reviews', protect, createProductReview);
router.get('/:id/reviews', getProductReviews);

// Admin product endpoints
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
