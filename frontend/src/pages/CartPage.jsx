import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingPrice,
    isFreeShipping,
    freeShippingDifference,
    freeShippingProgress,
    taxPrice,
    total,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyCoupon(promoInput.trim());
    if (ok) setPromoInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Your Skincare Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm mx-auto">
          Explore our dermatologist-formulated routines designed for your unique skin barrier.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-semibold rounded-full transition shadow-xs"
        >
          <span>Shop Skincare Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">Your Skincare Bag</h1>
        <p className="text-xs text-stone-500 mt-1">Review your formulations before proceeding to checkout</p>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-[#EBF1ED] p-4 rounded-2xl border border-stone-200 text-xs">
        {isFreeShipping ? (
          <div className="flex items-center gap-2 text-[#3D6B58] font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>You have unlocked <strong>FREE Standard Shipping</strong>!</span>
          </div>
        ) : (
          <div>
            <p className="text-stone-700">
              Add <strong className="text-stone-900">${freeShippingDifference.toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="divide-y divide-stone-100">
            {cartItems.map((item) => (
              <div key={item.product} className="py-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-stone-50 shrink-0 border border-stone-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      <Link to={`/product/${item.product}`} className="hover:text-[#3D6B58]">
                        {item.name}
                      </Link>
                    </h3>
                    {item.volume && <span className="text-xs text-stone-400 block mt-0.5">{item.volume}</span>}
                    <span className="text-xs font-semibold text-stone-700 block mt-1">
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="p-1 text-stone-500 hover:text-stone-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="p-1 text-stone-500 hover:text-stone-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="text-sm font-bold text-stone-900 w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 text-stone-400 hover:text-rose-500 transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs">
            <Link to="/shop" className="text-[#3D6B58] font-bold hover:underline">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-stone-400 hover:text-rose-600 transition"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900">Order Summary</h2>

            {/* Promo Code Input */}
            {couponCode ? (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-emerald-200">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Promo <strong>{couponCode}</strong> applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-emerald-900 underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (GLOW20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl uppercase tracking-wider focus:outline-none focus:border-[#3D6B58]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl transition"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingPrice === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (5%)</span>
                <span className="font-semibold text-stone-900">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-bold text-stone-900">
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                Guaranteed 256-Bit Encrypted Checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
