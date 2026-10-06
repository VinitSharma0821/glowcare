import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, shippingPrice, taxPrice, total, couponCode, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Shipping Form State
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [recipientName, setRecipientName] = useState(defaultAddr?.recipientName || user?.name || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || user?.phone || '');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [state, setState] = useState(defaultAddr?.state || 'CA');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '');
  const [country, setCountry] = useState(defaultAddr?.country || 'United States');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [upiId, setUpiId] = useState('');

  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500 mt-2">Please add skincare items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold">
          Explore Formulations
        </Link>
      </div>
    );
  }

  const handleSelectSavedAddress = (addr) => {
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!recipientName || !street || !city || !postalCode) {
      addToast('Please complete all mandatory shipping address fields', 'error');
      return;
    }

    if (!isAuthenticated) {
      addToast('Please sign in to complete your checkout and track orders', 'info');
      navigate('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          volume: item.volume
        })),
        shippingAddress: {
          recipientName,
          phone,
          street,
          city,
          state,
          postalCode,
          country
        },
        paymentMethod,
        couponCode,
        discountAmount
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        clearCart();
        addToast('Order placed successfully!', 'success');
        navigate(`/order-success/${res.data.order.orderNumber}`);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Could not place order. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#3D6B58]">
            Secure 256-Bit SSL Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Shipping & Payment
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form: Shipping + Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Saved Addresses quick-picker */}
          {user?.addresses && user.addresses.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Choose from Saved Addresses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => (
                  <button
                    key={addr._id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className="p-3 text-left rounded-xl border border-stone-200 hover:border-[#3D6B58] bg-stone-50/50 hover:bg-[#FAF8F5] transition text-xs"
                  >
                    <span className="font-bold text-stone-900 block">{addr.recipientName}</span>
                    <span className="text-stone-500 block truncate">{addr.street}</span>
                    <span className="text-stone-500 block">{addr.city}, {addr.state} {addr.postalCode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address Form */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Truck className="w-4 h-4 text-[#3D6B58]" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                1. Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Emma Watson"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="742 Evergreen Terrace, Apt 4B"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Beverly Hills"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="CA"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="90210"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Form */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <CreditCard className="w-4 h-4 text-[#3D6B58]" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                2. Select Payment Method
              </h2>
            </div>

            {/* Payment selection pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Credit/Debit Card', 'UPI / NetBanking', 'Cash on Delivery'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`p-3.5 rounded-2xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                    paymentMethod === m
                      ? 'border-[#3D6B58] bg-[#EBF1ED] text-[#3D6B58] shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span>{m}</span>
                  {paymentMethod === m && <CheckCircle2 className="w-4 h-4 text-[#3D6B58]" />}
                </button>
              ))}
            </div>

            {/* Method Inputs */}
            {paymentMethod === 'Credit/Debit Card' && (
              <div className="pt-3 space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Card Number (Mock Demo)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-4 py-2.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI / NetBanking' && (
              <div className="pt-3 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                <label className="text-xs font-semibold text-stone-700 block mb-1">UPI Virtual Address (VPA)</label>
                <input
                  type="text"
                  placeholder="username@okaxis or username@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-200 rounded-xl px-4 py-2.5"
                />
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div className="pt-2 text-xs text-stone-600 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                Pay in cash directly to carrier on delivery. Standard verification will be conducted.
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Items + Pricing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Review ({cartItems.reduce((a, b) => a + b.quantity, 0)} Items)
            </h2>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl bg-stone-50 shrink-0 border border-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                    <span className="text-[11px] text-stone-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({couponCode})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingPrice === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-semibold text-stone-900">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between text-lg font-bold text-stone-900">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-900 hover:bg-[#3D6B58] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md active:scale-98"
            >
              {loading ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order • ${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
