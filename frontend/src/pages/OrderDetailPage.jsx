import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronLeft,
  XCircle,
  MapPin,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { identifier } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${identifier}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [identifier]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${order._id}/cancel`, {
        reason: 'Customer initiated cancellation'
      });
      if (res.data.success) {
        setOrder(res.data.order);
        addToast('Order has been cancelled', 'info');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order';
      addToast(msg, 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#3D6B58] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs text-stone-400">Loading order timeline...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Order Not Found</h2>
        <Link to="/orders" className="mt-4 inline-block text-xs text-[#3D6B58] font-bold underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = order.orderStatus === 'Pending' || order.orderStatus === 'Processing';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
        {canCancel && (
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-lg transition"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D6B58]">
              Order Tracking Details
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1 font-mono">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-xs text-stone-400 block">Total Amount</span>
            <span className="text-2xl font-bold text-stone-900">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Visual Progress Timeline */}
        {isCancelled ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <strong className="block text-sm">Order Cancelled</strong>
              <span>This order has been cancelled and any charges have been refunded.</span>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-6">
              Fulfillment Journey
            </h3>
            <div className="grid grid-cols-4 relative gap-2 text-center">
              {STATUS_STEPS.map((s, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;
                return (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition z-10 ${
                        isPassed
                          ? 'bg-[#3D6B58] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isCurrent ? 'text-[#3D6B58] font-bold' : isPassed ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tracking info */}
        {order.trackingNumber && (
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#3D6B58]" />
              <span>USPS Tracking: <strong className="font-mono">{order.trackingNumber}</strong></span>
            </div>
            <span className="text-stone-500">Fast Priority Delivery</span>
          </div>
        )}

        {/* Items List */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-4">
            Order Items
          </h3>
          <div className="divide-y divide-stone-100">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl bg-stone-50" />
                  <div>
                    <h4 className="font-semibold text-stone-900">{item.name}</h4>
                    {item.volume && <span className="text-stone-400 block">{item.volume}</span>}
                    <span className="text-stone-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <span className="font-bold text-stone-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
          <div className="p-4 bg-stone-50 rounded-2xl">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#3D6B58]" />
              <span>Shipping Address</span>
            </div>
            <p className="text-stone-700 font-medium">{order.shippingAddress?.recipientName}</p>
            <p className="text-stone-500">{order.shippingAddress?.street}</p>
            <p className="text-stone-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-2">
              <CreditCard className="w-3.5 h-3.5 text-[#3D6B58]" />
              <span>Payment Details</span>
            </div>
            <p className="text-stone-700 font-medium">{order.paymentMethod}</p>
            <p className="text-stone-500">Status: <strong className="text-emerald-700">{order.paymentStatus}</strong></p>
            {order.couponCode && <p className="text-stone-500">Coupon: {order.couponCode}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
