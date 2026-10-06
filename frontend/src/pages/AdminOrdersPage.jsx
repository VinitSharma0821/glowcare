import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Edit3, X, Truck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../context/ToastContext';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Modal form state
  const [newStatus, setNewStatus] = useState('Processing');
  const [statusNote, setStatusNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const { addToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders', {
        params: { status: statusFilter }
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
      addToast('Error fetching orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setTrackingNumber(ord.trackingNumber || '');
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSavingStatus(true);
    try {
      const res = await api.put(`/orders/${selectedOrder._id}/status`, {
        orderStatus: newStatus,
        note: statusNote,
        trackingNumber
      });
      if (res.data.success) {
        addToast(`Order marked as ${newStatus}`, 'success');
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      addToast('Failed to update order status', 'error');
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <AdminLayout title="Customer Orders Management">
      <div className="space-y-6">
        {/* Top Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">All Placed Orders</h2>
            <span className="text-[11px] text-stone-400">Total: {orders.length} orders found</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-500">Filter status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 font-semibold text-stone-800"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-3 border-[#3D6B58] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-stone-400">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">
              No orders found matching status filter "{statusFilter}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date Placed</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Tracking</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-semibold text-stone-900 block">{ord.user?.name || 'Customer'}</span>
                        <span className="text-[11px] text-stone-400">{ord.user?.email}</span>
                      </td>
                      <td className="p-4 text-stone-600">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-stone-900">${ord.totalPrice?.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-50 text-blue-700'
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-stone-500">
                        {ord.trackingNumber || '—'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => openStatusModal(ord)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 z-10 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Manage Fulfillment</span>
                <h3 className="text-base font-bold text-stone-900 font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-semibold text-stone-900 text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Carrier Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. TRK-USPS-9812401"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Status Note / Fulfillment Comment</label>
                <textarea
                  rows="2"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Handed over to regional USPS air hub..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStatus}
                  className="px-5 py-2 bg-stone-900 hover:bg-[#3D6B58] text-white font-bold rounded-xl"
                >
                  {savingStatus ? 'Updating...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage;
