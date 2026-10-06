import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Users,
  ArrowLeft,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title = 'Admin Panel' }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-stone-100">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Restricted Access</h2>
          <p className="text-xs text-stone-600 mt-2">
            You must be logged in as an Administrator to view and manage GlowCare operations.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/login"
              className="py-2.5 px-4 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition"
            >
              Sign In as Admin
            </Link>
            <Link
              to="/"
              className="py-2.5 px-4 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Customer Accounts', path: '/admin/customers', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1E242B] text-stone-300 p-6 flex flex-col justify-between shrink-0 border-r border-stone-800">
        <div>
          {/* Admin Header */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#3D6B58] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-wide block">GlowCare</span>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Admin Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-[#3D6B58] text-white font-semibold shadow-xs'
                      : 'hover:bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-6 border-t border-stone-800 mt-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-stone-400 hover:text-white font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
          <div className="mt-4 pt-3 border-t border-stone-800/60 text-[11px] text-stone-500">
            Logged in as <span className="text-stone-300">{user?.name}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-stone-900">{title}</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 transition"
            >
              View Live Store
            </Link>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              AD
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
