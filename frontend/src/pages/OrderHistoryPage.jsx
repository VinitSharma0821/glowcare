import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'Shipped':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Shipped</span>;
      case 'Processing':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Processing</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-700">Pending</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">Order History</h1>
        <p className="text-xs text-stone-500 mt-1">Track current shipments and view previous purchases</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-3 border-[#3D6B58] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs text-stone-400">Loading your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Orders Yet</h3>
          <p className="text-xs text-stone-500 mt-1">You haven't placed any skincare orders yet.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block px-6 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white rounded-full text-xs font-semibold transition"
          >
            Start Exploring Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-900 font-mono">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-900">${order.totalPrice.toFixed(2)}</span>
                    <span className="text-[11px] text-stone-400 block">{order.orderItems.length} items</span>
                  </div>
                  <Link
                    to={`/order/${order.orderNumber}`}
                    className="p-2 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl transition"
                    aria-label="View order details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-[#FAF8F5] rounded-xl border border-stone-100">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">{item.name}</p>
                      <span className="text-[11px] text-stone-500">Qty: {item.quantity} • ${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
