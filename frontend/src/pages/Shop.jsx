import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  Sparkles,
  Filter,
  RotateCcw
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const SKIN_TYPES = ['All', 'Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const ROUTINE_STEPS = ['All', 'Cleanse', 'Tone', 'Treat', 'Moisturize', 'Protect', 'Mask & Care'];
const CONCERNS = [
  'All',
  'Acne & Blemishes',
  'Hydration & Dryness',
  'Brightening & Dullness',
  'Anti-Aging',
  'Redness & Sensitivity',
  'Sun Protection'
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSkinType, setSelectedSkinType] = useState(searchParams.get('skinType') || 'all');
  const [selectedConcern, setSelectedConcern] = useState(searchParams.get('concern') || 'all');
  const [selectedRoutineStep, setSelectedRoutineStep] = useState(searchParams.get('step') || 'all');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '60');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '0');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const kw = searchParams.get('keyword');
    if (kw) setKeyword(kw);
    const st = searchParams.get('skinType');
    if (st) setSelectedSkinType(st);
  }, [searchParams]);

  // Fetch categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {
          limit: 30,
          sort: sortBy
        };

        if (keyword.trim()) params.keyword = keyword.trim();
        if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedSkinType && selectedSkinType !== 'all') params.skinType = selectedSkinType;
        if (selectedConcern && selectedConcern !== 'all') params.concern = selectedConcern;
        if (selectedRoutineStep && selectedRoutineStep !== 'all') params.routineStep = selectedRoutineStep;
        if (maxPrice) params.maxPrice = maxPrice;
        if (Number(minRating) > 0) params.minRating = minRating;

        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [
    keyword,
    selectedCategory,
    selectedSkinType,
    selectedConcern,
    selectedRoutineStep,
    maxPrice,
    minRating,
    sortBy
  ]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
    setSelectedSkinType('all');
    setSelectedConcern('all');
    setSelectedRoutineStep('all');
    setMaxPrice('60');
    setMinRating('0');
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    keyword !== '' ||
    selectedCategory !== 'all' ||
    selectedSkinType !== 'all' ||
    selectedConcern !== 'all' ||
    selectedRoutineStep !== 'all' ||
    maxPrice !== '60' ||
    minRating !== '0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-[#F0EDE6] rounded-3xl p-6 md:p-10 border border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#3D6B58]">
            Pure Skincare Catalogue
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
            Discover Clean Clinical Formulations
          </h1>
          <p className="text-xs md:text-sm text-stone-600 mt-2 max-w-xl">
            Targeted active serums, gentle barrier cleansers, and broad-spectrum mineral sunscreens tailored to your skin type.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search active, ingredient, name..."
            className="w-full text-xs bg-white border border-stone-300 rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D6B58]/30 shadow-2xs text-stone-900"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#3D6B58]" />
              <h2 className="text-sm font-bold text-stone-900">Filter Catalogue</h2>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#D97762] hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Category</h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                  selectedCategory === 'all'
                    ? 'bg-[#EBF1ED] text-[#3D6B58] font-bold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-[#EBF1ED] text-[#3D6B58] font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span className="text-[10px] text-stone-400">({cat.productCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Skin Type</h3>
            <div className="flex flex-wrap gap-1.5">
              {SKIN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedSkinType(type === 'All' ? 'all' : type)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                    (selectedSkinType === 'all' && type === 'All') || selectedSkinType === type
                      ? 'border-[#3D6B58] bg-[#3D6B58] text-white font-medium'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-stone-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Routine Step */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Regimen Step</h3>
            <div className="space-y-1">
              {ROUTINE_STEPS.map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setSelectedRoutineStep(step === 'All' ? 'all' : step)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                    (selectedRoutineStep === 'all' && step === 'All') || selectedRoutineStep === step
                      ? 'bg-[#EBF1ED] text-[#3D6B58] font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Concern */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Skin Concern</h3>
            <div className="space-y-1">
              {CONCERNS.map((con) => (
                <button
                  key={con}
                  type="button"
                  onClick={() => setSelectedConcern(con === 'All' ? 'all' : con)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                    (selectedConcern === 'all' && con === 'All') || selectedConcern === con
                      ? 'bg-[#EBF1ED] text-[#3D6B58] font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {con}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-[#3D6B58]">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-[#3D6B58] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>$15</span>
              <span>$60</span>
            </div>
          </div>
        </div>

        {/* PRODUCTS LIST SECTION */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Bar: Results Count + Sort Dropdown + Mobile Filter Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-stone-800 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
              <span className="text-xs text-stone-500">
                Showing <strong className="text-stone-900">{products.length}</strong> of{' '}
                <strong className="text-stone-900">{totalCount}</strong> formulations
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#3D6B58]"
              >
                <option value="featured">Featured Picks</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white border border-stone-200 text-stone-700">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3 text-stone-400 hover:text-stone-700" /></button>
                </span>
              )}
              {selectedSkinType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white border border-stone-200 text-stone-700">
                  Skin: {selectedSkinType}
                  <button onClick={() => setSelectedSkinType('all')}><X className="w-3 h-3 text-stone-400 hover:text-stone-700" /></button>
                </span>
              )}
              {selectedConcern !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white border border-stone-200 text-stone-700">
                  Concern: {selectedConcern}
                  <button onClick={() => setSelectedConcern('all')}><X className="w-3 h-3 text-stone-400 hover:text-stone-700" /></button>
                </span>
              )}
              {keyword && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white border border-stone-200 text-stone-700">
                  Search: "{keyword}"
                  <button onClick={() => setKeyword('')}><X className="w-3 h-3 text-stone-400 hover:text-stone-700" /></button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#D97762] hover:underline font-semibold ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-stone-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">No matching skincare formulations found</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, clearing the skin concern filter, or searching for a different active ingredient.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-[#3D6B58] transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Category</h4>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg ${selectedCategory === 'all' ? 'bg-[#EBF1ED] text-[#3D6B58] font-bold' : 'text-stone-600'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg ${selectedCategory === cat.slug ? 'bg-[#EBF1ED] text-[#3D6B58] font-bold' : 'text-stone-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Type */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Skin Type</h4>
              <div className="flex flex-wrap gap-1.5">
                {SKIN_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedSkinType(type === 'All' ? 'all' : type)}
                    className={`text-xs px-2.5 py-1 rounded-lg border ${
                      (selectedSkinType === 'all' && type === 'All') || selectedSkinType === type
                        ? 'border-[#3D6B58] bg-[#3D6B58] text-white'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply & Close */}
            <div className="pt-6 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-[#3D6B58] transition"
              >
                Show Results ({totalCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
