const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc Get admin dashboard summary statistics
// @route GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from non-cancelled orders
    const completedOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Count low stock items (e.g. stock <= 10)
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Category breakdown
    const categories = await Category.find();
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return { name: cat.name, count };
      })
    );

    // Status breakdown
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount,
        ordersByStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        }
      },
      categoryStats,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Get all customers with orders summary
// @route GET /api/admin/customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

    const enrichedCustomers = await Promise.all(
      customers.map(async (cust) => {
        const orders = await Order.find({ user: cust._id, orderStatus: { $ne: 'Cancelled' } });
        const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        return {
          ...cust.toObject(),
          orderCount: orders.length,
          totalSpent: Math.round(totalSpent * 100) / 100
        };
      })
    );

    res.json({ success: true, customers: enrichedCustomers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
