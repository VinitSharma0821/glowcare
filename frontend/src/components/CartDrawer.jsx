import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingPrice,
    isFreeShipping,
    freeShippingDifference,
    freeShippingProgress,
    total,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyCoupon(promoInput.trim());
    if (ok) setPromoInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#3D6B58]" />
              <h2 className="text-lg font-bold text-stone-900">Your Skincare Bag</h2>
              <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full font-semibold text-stone-600">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#F0EDE6] px-5 py-3 border-b border-stone-200 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-1.5 text-[#3D6B58] font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>You've unlocked <strong>FREE Standard Shipping</strong>!</span>
              </div>
            ) : (
              <div>
                <p className="text-stone-700">
                  Add <strong className="text-stone-900">${freeShippingDifference.toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>
                </p>
                <div className="w-full bg-stone-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-[#3D6B58] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-800">Your bag is currently empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Discover our dermatologist-formulated clean skincare routines to get glowing skin.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-semibold rounded-full transition shadow-xs"
                >
                  Shop Skincare Catalogue
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-stone-200/80 shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 object-cover rounded-lg bg-stone-50 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                          <Link
                            to={`/product/${item.product}`}
                            onClick={() => setIsCartOpen(false)}
                            className="hover:text-[#3D6B58]"
                          >
                            {item.name}
                          </Link>
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product)}
                          className="text-stone-400 hover:text-rose-500 transition p-0.5 ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.volume && (
                        <p className="text-[11px] text-stone-400 mt-0.5">{item.volume}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          className="p-1 hover:text-[#3D6B58] text-stone-600 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          className="p-1 hover:text-[#3D6B58] text-stone-600 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-4">
              {/* Promo code form */}
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium border border-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. GLOW20)"
                    className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg uppercase tracking-wide focus:outline-none focus:border-[#3D6B58]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-stone-900">
                    {shippingPrice === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-bold text-stone-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-[#1E242B] hover:bg-[#3D6B58] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
