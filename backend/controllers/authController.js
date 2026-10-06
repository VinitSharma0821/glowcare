const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'glowcare_jwt_super_secret_key_2026_skincare', {
    expiresIn: '30d'
  });
};

// @desc Register a new user
// @route POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, skinType, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      skinType: skinType || 'Not Specified',
      phone: phone || ''
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skinType: user.skinType,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skinType: user.skinType,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.skinType = req.body.skinType || user.skinType;
    if (req.body.skinConcerns) {
      user.skinConcerns = req.body.skinConcerns;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skinType: updatedUser.skinType,
        skinConcerns: updatedUser.skinConcerns,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Change Password
// @route PUT /api/auth/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add Address
// @route POST /api/auth/address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { recipientName, phone, street, city, state, postalCode, country, isDefault } = req.body;

    if (!recipientName || !street || !city || !postalCode) {
      return res.status(400).json({ success: false, message: 'Please fill all required address fields' });
    }

    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
      recipientName,
      phone: phone || user.phone || '',
      street,
      city,
      state: state || '',
      postalCode,
      country: country || 'United States',
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete Address
// @route DELETE /api/auth/address/:addressId
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle Wishlist item
// @route POST /api/auth/wishlist/:productId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const index = user.wishlist.findIndex(id => id.toString() === productId);
    let isAdded = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();
    await user.populate('wishlist');

    res.json({
      success: true,
      isWishlisted: isAdded,
      wishlist: user.wishlist,
      message: isAdded ? 'Added to your wishlist' : 'Removed from your wishlist'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
