import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SkinRoutineQuizModal from './components/SkinRoutineQuizModal';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminCustomersPage from './pages/AdminCustomersPage';

const AppContent = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Show Storefront Navbar & Footer only on non-admin routes */}
      {!isAdminRoute && <Navbar onOpenQuiz={() => setIsQuizOpen(true)} />}

      <main className="flex-1">
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<Home onOpenQuiz={() => setIsQuizOpen(true)} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:identifier" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/order/:identifier" element={<OrderDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer onOpenQuiz={() => setIsQuizOpen(true)} />}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Routine Finder Modal */}
      <SkinRoutineQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
