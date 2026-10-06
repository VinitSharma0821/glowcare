import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3D6B58', '#D97762', '#E2C290', '#FAF8F5']
      });
    } catch (e) {
      // ignore
    }

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderNumber}`);
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
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 bg-emerald-50 text-[#3D6B58] rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#3D6B58]">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          We've received your order and our lab team is carefully packaging your fresh formulations.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs text-stone-400 block">Order Number</span>
            <span className="text-base font-bold text-stone-900 font-mono">{orderNumber}</span>
          </div>
          {order?.trackingNumber && (
            <div>
              <span className="text-xs text-stone-400 block">Tracking Number</span>
              <span className="text-xs font-semibold text-[#3D6B58] font-mono">{order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Delivery notice */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
          <Truck className="w-5 h-5 text-[#3D6B58] shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-stone-900 block">Estimated Arrival</span>
            <span className="text-stone-600">
              {order?.estimatedDelivery
                ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                : '3-4 business days via USPS Priority'}
            </span>
          </div>
        </div>

        {/* Ordered Items Preview */}
        {order?.orderItems && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Items in this Package
            </h3>
            <div className="divide-y divide-stone-100">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-stone-50" />
                    <div>
                      <span className="font-semibold text-stone-900 block">{item.name}</span>
                      <span className="text-stone-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Paid</span>
              <span>${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-7 py-3.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-semibold rounded-full transition shadow-xs flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Track Order History</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-7 py-3.5 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-semibold rounded-full transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
