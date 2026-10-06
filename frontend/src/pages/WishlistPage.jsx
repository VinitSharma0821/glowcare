import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Your Saved Wishlist</h1>
        <p className="text-xs text-stone-500 mt-2">
          Please log in to your account to view your saved products across devices.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block px-7 py-3 bg-stone-900 hover:bg-[#3D6B58] text-white rounded-full text-xs font-semibold transition"
        >
          Sign In to GlowCare
        </Link>
      </div>
    );
  }

  const wishlistProducts = user?.wishlist || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">Saved Wishlist</h1>
        <p className="text-xs text-stone-500 mt-1">Formulations you've earmarked for your next routine update</p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Saved Items Yet</h3>
          <p className="text-xs text-stone-500 mt-1">
            Tap the heart icon on any skincare product to save it here for later.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white rounded-full text-xs font-semibold transition"
          >
            <span>Explore Skincare Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((prod) => (
            <ProductCard
              key={typeof prod === 'string' ? prod : prod._id}
              product={typeof prod === 'string' ? { _id: prod, name: 'Saved Product' } : prod}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
