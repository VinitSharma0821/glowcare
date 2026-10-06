const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to generate readable unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `GC-${timestamp}-${random}`;
};

// @desc Create new order
// @route POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      discountAmount = 0
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Verify products, check stock, and calculate prices server-side
    let calculatedItemsPrice = 0;
    const verifiedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      calculatedItemsPrice += itemTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.thumbnail || (product.images && product.images[0]) || '',
        volume: product.volume || ''
      });
    }

    // Shipping rules: Free if items total > $50, else $5.99
    let shippingPrice = calculatedItemsPrice >= 50 ? 0 : 5.99;
    let discountPrice = Number(discountAmount) || 0;

    // Apply promo code discount if valid
    if (couponCode) {
      const upperCoupon = couponCode.trim().toUpperCase();
      if (upperCoupon === 'GLOW20') {
        discountPrice = Math.round(calculatedItemsPrice * 0.20 * 100) / 100;
      } else if (upperCoupon === 'FREESHIP') {
        shippingPrice = 0;
      } else if (upperCoupon === 'FIRSTGLOW') {
        discountPrice = 10;
      }
    }

    const taxableAmount = Math.max(0, calculatedItemsPrice - discountPrice);
    const taxPrice = Math.round(taxableAmount * 0.05 * 100) / 100; // 5% sales tax
    const totalPrice = Math.round((taxableAmount + shippingPrice + taxPrice) * 100) / 100;

    const orderNumber = generateOrderNumber();
    const isCOD = paymentMethod === 'Cash on Delivery';

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      orderItems: verifiedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit/Debit Card',
      paymentStatus: isCOD ? 'Pending' : 'Paid',
      paymentDetails: {
        transactionId: `TXN-${Date.now()}`,
        cardLast4: paymentMethod === 'Credit/Debit Card' ? '4242' : ''
      },
      itemsPrice: calculatedItemsPrice,
      shippingPrice,
      discountPrice,
      taxPrice,
      totalPrice,
      couponCode: couponCode || '',
      orderStatus: isCOD ? 'Pending' : 'Processing',
      trackingNumber: `TRK-USPS-${Math.floor(100000000 + Math.random() * 900000000)}`,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days delivery
      statusHistory: [
        {
          status: isCOD ? 'Pending' : 'Processing',
          date: new Date(),
          note: isCOD ? 'Order received. Payment pending on delivery.' : 'Payment received. Order is being prepared in our cleanroom facility.'
        }
      ]
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get logged in user's orders
// @route GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get order by ID or orderNumber
// @route GET /api/orders/:identifier
exports.getOrderById = async (req, res) => {
  try {
    const { identifier } = req.params;
    let order;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier).populate('user', 'name email phone');
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: identifier }).populate('user', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: must be owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Cancel order
// @route PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled as it has already been shipped or delivered'
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    // Restock items
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      date: new Date(),
      note: req.body.reason || 'Cancelled by customer'
    });

    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Get all orders
// @route GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: Update order status
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, note, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    order.statusHistory.push({
      status: orderStatus,
      date: new Date(),
      note: note || `Order marked as ${orderStatus}`
    });

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
