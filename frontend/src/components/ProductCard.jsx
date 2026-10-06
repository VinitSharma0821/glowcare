import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();

  const wishlisted = isWishlisted(product._id);
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Top Badges & Wishlist */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#3D6B58] text-white rounded-full shadow-xs">
              Bestseller
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#D97762] text-white rounded-full shadow-xs">
              Save {discountPercent}%
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-amber-600 text-white rounded-full shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-rose-50 text-rose-500 scale-105'
              : 'bg-white/90 text-stone-600 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Link overlay on hover */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
          <Link
            to={`/product/${product.slug || product._id}`}
            className="w-full py-2 bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 backdrop-blur-xs transition"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Skin Type Tag */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium tracking-wide uppercase text-[11px] text-[#3D6B58]">
              {product.categoryName || product.category?.name || 'Skincare'}
            </span>
            {product.volume && (
              <span className="text-[11px] text-stone-400">{product.volume}</span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-[#3D6B58] transition-colors">
            <Link to={`/product/${product.slug || product._id}`}>
              {product.name}
            </Link>
          </h3>

          {/* Short subtitle / benefits */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-1">
            {product.subtitle || product.shortDescription}
          </p>

          {/* Rating */}
          <div className="mt-2.5">
            <RatingStars
              rating={product.rating || 5}
              showScore={true}
              reviewsCount={product.numReviews}
            />
          </div>

          {/* Suitable Skin types tags */}
          {product.skinTypes && product.skinTypes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {product.skinTypes.slice(0, 3).map((st) => (
                <span
                  key={st}
                  className="px-2 py-0.5 text-[10px] bg-stone-100 text-stone-600 rounded-md font-medium"
                >
                  {st}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900">
                ${product.price?.toFixed(2)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  ${product.compareAtPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-[10px] text-amber-600 font-medium">Only {product.stock} left!</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              product.stock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-[#3D6B58] text-white active:scale-95'
            }`}
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
