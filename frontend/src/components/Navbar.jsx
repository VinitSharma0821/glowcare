import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Navbar = ({ onOpenQuiz }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Live search debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get('/products', {
          params: { keyword: searchQuery.trim(), limit: 4 }
        });
        if (res.data.success) {
          setSearchResults(res.data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
  };

  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top promotional bar */}
      <div className="bg-[#1E242B] text-stone-200 text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="hidden sm:inline">🌿 Dermatologist Formulated • 100% Vegan & Cruelty-Free</span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span>Free standard shipping on all orders over $50</span>
        <span className="hidden md:inline opacity-40">|</span>
        <span className="hidden md:inline text-amber-300 font-semibold">Code GLOW20 saves 20%</span>
      </div>

      {/* Main Navigation */}
      <nav className="glass-nav border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#3D6B58] text-white flex items-center justify-center shadow-xs group-hover:bg-[#2F5243] transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-[#3D6B58] transition-colors">
                GlowCare
              </span>
              <span className="hidden sm:block text-[9px] font-bold tracking-widest uppercase text-stone-400 -mt-1">
                Botanical Science
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-700">
            <Link to="/shop" className="hover:text-[#3D6B58] transition py-1">
              Shop All
            </Link>
            <Link to="/shop?category=cleansers" className="hover:text-[#3D6B58] transition py-1">
              Cleansers
            </Link>
            <Link to="/shop?category=serums" className="hover:text-[#3D6B58] transition py-1">
              Serums
            </Link>
            <Link to="/shop?category=moisturizers" className="hover:text-[#3D6B58] transition py-1">
              Moisturizers
            </Link>
            <Link to="/shop?category=sunscreens" className="hover:text-[#3D6B58] transition py-1">
              Sunscreens
            </Link>
            <button
              type="button"
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF1ED] text-[#3D6B58] hover:bg-[#3D6B58] hover:text-white transition shadow-2xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Routine Quiz</span>
            </button>
          </div>

          {/* Right Actions: Search, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Search Bar */}
            <div className="relative" ref={searchRef}>
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition lg:hidden"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Desktop Search Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden lg:flex items-center relative w-56 xl:w-72"
              >
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search serum, SPF, retinol..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full text-xs bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-stone-200/80 rounded-full pl-9 pr-4 py-2 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3D6B58]/30 transition"
                />
              </form>

              {/* Search Suggestions Dropdown */}
              {isSearchOpen && (searchQuery.length >= 2 || searchResults.length > 0) && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1.5">
                    {searchLoading ? 'Searching...' : searchResults.length > 0 ? 'Suggested Products' : 'No products found'}
                  </div>

                  <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product.slug || product._id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-stone-50 rounded-xl transition"
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-stone-900 truncate">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {product.categoryName} • ${product.price?.toFixed(2)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 mt-1 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-xs font-semibold text-[#3D6B58] hover:underline py-1"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition"
              aria-label="Saved products"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D97762] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-[#3D6B58] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold text-stone-800 max-w-[90px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                        {user?.skinType && user.skinType !== 'Not Specified' && (
                          <span className="inline-block mt-1 text-[10px] font-semibold bg-[#EBF1ED] text-[#3D6B58] px-2 py-0.5 rounded-md">
                            {user.skinType} Skin
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-700 hover:bg-amber-50 font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        <span>Profile & Addresses</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50"
                      >
                        <Package className="w-4 h-4 text-stone-400" />
                        <span>My Orders</span>
                      </Link>

                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-[#3D6B58] text-white rounded-full transition shadow-2xs"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpen && (
          <div className="mt-3 lg:hidden px-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products, serums, SPF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-stone-100 border border-stone-200 rounded-full pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D6B58]/30"
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-stone-200 flex flex-col gap-3 text-sm font-medium text-stone-800">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Shop All Products
            </Link>
            <Link
              to="/shop?category=cleansers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Cleansers
            </Link>
            <Link
              to="/shop?category=serums"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Serums & Actives
            </Link>
            <Link
              to="/shop?category=moisturizers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Moisturizers & Barrier Creams
            </Link>
            <Link
              to="/shop?category=sunscreens"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              Sunscreens SPF 50+
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="text-left py-2 px-3 rounded-lg bg-[#EBF1ED] text-[#3D6B58] font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Routine Diagnostic Quiz
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg bg-amber-50 text-amber-800 font-bold"
              >
                Admin Control Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
