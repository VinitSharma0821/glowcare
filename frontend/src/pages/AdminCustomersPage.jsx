import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/admin/customers');
        if (res.data.success) {
          setCustomers(res.data.customers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <AdminLayout title="Registered Customer Accounts">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">Customer Roster</h2>
          <p className="text-xs text-stone-500">View registered user accounts, order volume, and skincare profiles</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-3 border-[#3D6B58] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-stone-400">Loading customers...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">
              No registered customer profiles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Skin Profile</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4">Orders Placed</th>
                    <th className="p-4 text-right">Lifetime Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center shrink-0">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{c.name}</span>
                            {c.phone && <span className="text-[11px] text-stone-400">{c.phone}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-stone-600 font-medium">{c.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#EBF1ED] text-[#3D6B58] font-bold text-[11px]">
                          {c.skinType || 'Not Specified'}
                        </span>
                      </td>
                      <td className="p-4 text-stone-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-semibold text-stone-800">
                        {c.orderCount} Orders
                      </td>
                      <td className="p-4 text-right font-bold text-stone-900">
                        ${c.totalSpent?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
