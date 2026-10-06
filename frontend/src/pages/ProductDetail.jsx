import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Droplets,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Star
} from 'lucide-react';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { identifier } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('how-to-use');
  const [loading, setLoading] = useState(true);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [ratingCounts, setRatingCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user, isAuthenticated, toggleWishlist, isWishlisted } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${identifier}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setSelectedImage(res.data.product.thumbnail || res.data.product.images?.[0]);
          setRelatedProducts(res.data.relatedProducts || []);
          fetchReviews(res.data.product._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [identifier]);

  const fetchReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const res = await api.get(`/products/${productId}/reviews`);
      if (res.data.success) {
        setReviews(res.data.reviews);
        setRatingCounts(res.data.ratingCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please log in to submit a review.', 'info');
      return;
    }
    if (!newComment.trim() || !newTitle.trim()) {
      addToast('Please fill out the headline and review comments.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: newRating,
        title: newTitle,
        comment: newComment
      });
      if (res.data.success) {
        addToast('Thank you! Your verified review has been published.', 'success');
        setNewTitle('');
        setNewComment('');
        fetchReviews(product._id);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit review';
      addToast(msg, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#3D6B58] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
          Loading Formulation Details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">The formulation you are searching for does not exist.</p>
        <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const imagesList = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link to="/shop" className="hover:text-stone-900">Catalogue</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link to={`/shop?category=${product.category?.slug || product.categoryName}`} className="hover:text-stone-900">
          {product.categoryName || 'Category'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-stone-900 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Top Section: Image Gallery + Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#3D6B58] text-white text-xs font-bold uppercase rounded-full shadow-xs">
                Bestseller
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === img ? 'border-[#3D6B58] shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#3D6B58]">
                {product.categoryName} • Step: {product.routineStep || 'Treat'}
              </span>
              <span className="text-xs font-semibold text-stone-400">{product.volume}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-stone-500 mt-1 font-medium">{product.subtitle}</p>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.rating} showScore={true} reviewsCount={product.numReviews} />
              <a href="#reviews-section" className="text-xs text-[#3D6B58] font-semibold underline">
                Read Verified Reviews
              </a>
            </div>
          </div>

          {/* Price Box */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-bold text-stone-900">
              ${product.price?.toFixed(2)}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-sm text-stone-400 line-through">
                ${product.compareAtPrice?.toFixed(2)}
              </span>
            )}
            {product.compareAtPrice > product.price && (
              <span className="text-xs font-bold text-white bg-[#D97762] px-2 py-0.5 rounded-md">
                Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200 pt-4">
            {product.description}
          </p>

          {/* Suitable Skin Types tags */}
          {product.skinTypes && (
            <div>
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                Ideal For Skin Types:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.skinTypes.map((st) => (
                  <span
                    key={st}
                    className="px-3 py-1 bg-white border border-stone-200 text-stone-700 text-xs rounded-full font-medium shadow-2xs"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Quantity & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-600 hover:text-stone-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-600 hover:text-stone-900"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className="flex-1 py-4 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag • ${(product.price * quantity).toFixed(2)}</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product._id)}
                className={`p-4 rounded-xl border transition ${
                  wishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-500'
                    : 'border-stone-300 bg-white text-stone-600 hover:text-rose-500'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Shipping & Guarantee perks */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#3D6B58]" />
                <span>Free shipping on orders $50+</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#3D6B58]" />
                <span>30-day glow guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEY ACTIVE INGREDIENTS SECTION */}
      {product.keyIngredients && product.keyIngredients.length > 0 && (
        <section className="bg-white rounded-3xl p-8 md:p-10 border border-stone-200/80 shadow-xs">
          <div className="max-w-2xl mb-6">
            <span className="text-xs uppercase font-bold tracking-wider text-[#3D6B58]">
              Biocompatible Science
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              Key Active Ingredients & Dermal Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.keyIngredients.map((ing, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EBF1ED] text-[#3D6B58] flex items-center justify-center font-bold text-xs mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{ing.name}</h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{ing.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DETAILED TABS: HOW TO USE, INGREDIENTS (INCI), BENEFITS */}
      <section className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/80 shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-stone-200 gap-6 text-xs md:text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('how-to-use')}
            className={`pb-3 transition relative ${
              activeTab === 'how-to-use' ? 'text-[#3D6B58] border-b-2 border-[#3D6B58]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            How to Apply
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 transition relative ${
              activeTab === 'ingredients' ? 'text-[#3D6B58] border-b-2 border-[#3D6B58]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Full Ingredients (INCI)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 transition relative ${
              activeTab === 'benefits' ? 'text-[#3D6B58] border-b-2 border-[#3D6B58]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Texture & Sensory Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'how-to-use' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Application Ritual:
              </h3>
              <ol className="space-y-3">
                {product.howToUse?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-stone-600">
                    <span className="w-6 h-6 rounded-full bg-[#EBF1ED] text-[#3D6B58] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Full INCI Transparency:
              </h3>
              <p className="text-xs text-stone-600 font-mono leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-stone-200">
                {product.fullIngredients || 'Aqua, Glycerin, Sodium Hyaluronate, Tocopherol, Phenoxyethanol.'}
              </p>
              <p className="text-[11px] text-stone-400">
                Formulated without parabens, sulfates (SLS/SLES), synthetic artificial dyes, or mineral oil.
              </p>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Texture</h4>
                <p className="text-xs md:text-sm text-stone-600">{product.texture}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Aroma & Scent</h4>
                <p className="text-xs md:text-sm text-stone-600">{product.scent}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RATINGS & VERIFIED REVIEWS SECTION */}
      <section id="reviews-section" className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/80 shadow-xs space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#3D6B58]">
              Verified Feedback
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              Customer Experiences & Reviews
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
            <div className="text-center">
              <span className="text-3xl font-serif font-bold text-stone-900">{product.rating}</span>
              <div className="flex justify-center mt-1">
                <RatingStars rating={product.rating} />
              </div>
              <span className="text-[11px] text-stone-400 block mt-0.5">
                {product.numReviews} Verified Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Write a Review Box */}
        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
            Share Your Experience
          </h3>
          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          newRating >= star ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-stone-600 ml-2">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cleared my redness in 1 week!"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Detailed Review</label>
                <textarea
                  rows="3"
                  required
                  placeholder="How did your skin react? What was your routine order?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-300 rounded-xl p-4 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl transition"
              >
                {submittingReview ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-stone-600">Please sign in to write a review for this product.</p>
              <Link to="/login" className="mt-2 inline-block text-xs font-bold text-[#3D6B58] hover:underline">
                Sign in to your GlowCare account →
              </Link>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-6">
              Be the first to share your thoughts on this formula!
            </p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-2xl bg-white border border-stone-200/80 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{rev.userName}</span>
                    {rev.userSkinType && (
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                        {rev.userSkinType} Skin
                      </span>
                    )}
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <RatingStars rating={rev.rating} />
                </div>
                <h4 className="text-xs font-bold text-stone-800">{rev.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-stone-400 block pt-1">
                  {new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* RELATED FORMULATIONS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Complementary Formulations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
