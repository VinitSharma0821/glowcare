import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('glowcare_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState(localStorage.getItem('glowcare_coupon') || '');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponFixedDiscount, setCouponFixedDiscount] = useState(0);
  const [isFreeShippingCoupon, setIsFreeShippingCoupon] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('glowcare_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (couponCode) {
      evaluateCoupon(couponCode, false);
    }
  }, [cartItems]);

  const evaluateCoupon = (code, notify = true) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GLOW20') {
      setCouponDiscountPercent(20);
      setCouponFixedDiscount(0);
      setIsFreeShippingCoupon(false);
      setCouponCode('GLOW20');
      localStorage.setItem('glowcare_coupon', 'GLOW20');
      if (notify) addToast('Promo code "GLOW20" applied! 20% off your order.', 'success');
      return true;
    } else if (clean === 'FREESHIP') {
      setIsFreeShippingCoupon(true);
      setCouponDiscountPercent(0);
      setCouponFixedDiscount(0);
      setCouponCode('FREESHIP');
      localStorage.setItem('glowcare_coupon', 'FREESHIP');
      if (notify) addToast('Promo code "FREESHIP" applied! Free standard shipping unlocked.', 'success');
      return true;
    } else if (clean === 'FIRSTGLOW') {
      setCouponFixedDiscount(10);
      setCouponDiscountPercent(0);
      setIsFreeShippingCoupon(false);
      setCouponCode('FIRSTGLOW');
      localStorage.setItem('glowcare_coupon', 'FIRSTGLOW');
      if (notify) addToast('Promo code "FIRSTGLOW" applied! $10.00 off your order.', 'success');
      return true;
    } else {
      if (notify) addToast('Invalid promo code. Try GLOW20, FREESHIP, or FIRSTGLOW', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
    setCouponFixedDiscount(0);
    setIsFreeShippingCoupon(false);
    localStorage.removeItem('glowcare_coupon');
    addToast('Coupon code removed.', 'info');
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === (product._id || product.product));
      if (existing) {
        return prevItems.map((item) =>
          item.product === (product._id || product.product)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id || product.product,
            name: product.name,
            price: product.price,
            image: product.thumbnail || (product.images && product.images[0]) || product.image,
            volume: product.volume || '',
            stock: product.stock !== undefined ? product.stock : 99,
            quantity
          }
        ];
      }
    });

    addToast(`Added "${product.name}" to bag!`, 'success');
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    removeCoupon();
    localStorage.removeItem('glowcare_cart');
  };

  // Calculations
  const subtotal = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100
  ) / 100;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (couponDiscountPercent > 0) {
    discountAmount = Math.round(subtotal * (couponDiscountPercent / 100) * 100) / 100;
  } else if (couponFixedDiscount > 0) {
    discountAmount = Math.min(subtotal, couponFixedDiscount);
  }

  // Shipping: Free if subtotal >= 50 or free shipping coupon, else $5.99
  const freeShippingThreshold = 50.0;
  const isFreeShipping = subtotal >= freeShippingThreshold || isFreeShippingCoupon;
  const shippingPrice = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : 5.99;
  const freeShippingDifference = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Tax: 5% on subtotal after discount
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxPrice = Math.round(taxableAmount * 0.05 * 100) / 100;

  // Final Total
  const total = Math.round((taxableAmount + shippingPrice + taxPrice) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        applyCoupon: evaluateCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingPrice,
        isFreeShipping,
        freeShippingThreshold,
        freeShippingDifference,
        freeShippingProgress,
        taxPrice,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
