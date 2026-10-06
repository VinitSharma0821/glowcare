import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const AdminDashboardPage = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Analytics & Overview">
        <div className="text-center py-20">
          <div className="w-8 h-8 border-3 border-[#3D6B58] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs text-stone-400">Loading operations analytics...</span>
        </div>
      </AdminLayout>
    );
  }

  const { stats, categoryStats, recentOrders } = statsData || {
    stats: {},
    categoryStats: [],
    recentOrders: []
  };

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">${stats.totalRevenue?.toFixed(2)}</p>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Non-cancelled orders
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{stats.totalOrders}</p>
            <span className="text-[11px] text-stone-400 mt-1 block">All-time customer checkouts</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Catalogue Items</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{stats.totalProducts}</p>
            <span className="text-[11px] text-stone-400 mt-1 block">Active skincare formulations</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{stats.totalCustomers}</p>
            <span className="text-[11px] text-stone-400 mt-1 block">Registered profiles</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{stats.lowStockCount}</p>
            <span className="text-[11px] text-rose-600 font-medium mt-1 block">Items below 10 units</span>
          </div>
        </div>

        {/* Order Status Breakdown Strip */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-4">
            Order Fulfillment Pipeline Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl text-center">
              <span className="text-xs text-stone-500 block">Pending</span>
              <strong className="text-lg text-stone-900">{stats.ordersByStatus?.pending || 0}</strong>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-center">
              <span className="text-xs text-amber-800 block">Processing</span>
              <strong className="text-lg text-amber-900">{stats.ordersByStatus?.processing || 0}</strong>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-center">
              <span className="text-xs text-blue-800 block">Shipped</span>
              <strong className="text-lg text-blue-900">{stats.ordersByStatus?.shipped || 0}</strong>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-center">
              <span className="text-xs text-emerald-800 block">Delivered</span>
              <strong className="text-lg text-emerald-900">{stats.ordersByStatus?.delivered || 0}</strong>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-center">
              <span className="text-xs text-rose-800 block">Cancelled</span>
              <strong className="text-lg text-rose-900">{stats.ordersByStatus?.cancelled || 0}</strong>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Recent Customer Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#3D6B58] hover:underline flex items-center gap-1"
            >
              <span>Manage All Orders</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-semibold">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                    <td className="py-3">
                      <span className="font-semibold text-stone-900 block">{ord.user?.name || 'Customer'}</span>
                      <span className="text-[11px] text-stone-400">{ord.user?.email}</span>
                    </td>
                    <td className="py-3 text-stone-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-bold text-stone-900">${ord.totalPrice?.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
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
                    <td className="py-3 text-right">
                      <Link
                        to={`/order/${ord.orderNumber}`}
                        className="text-xs text-[#3D6B58] font-bold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-100">
            Formulation Inventory Distribution
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categoryStats.map((cat, i) => (
              <div key={i} className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-100">
                <span className="text-xs text-stone-600 font-medium block truncate">{cat.name}</span>
                <span className="text-xl font-bold text-stone-900 mt-1 block">{cat.count} Formulations</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
