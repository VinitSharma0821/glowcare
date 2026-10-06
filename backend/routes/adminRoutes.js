const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllCustomers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/customers', protect, admin, getAllCustomers);

module.exports = router;
