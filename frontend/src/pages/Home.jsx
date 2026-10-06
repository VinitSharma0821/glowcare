import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Droplets,
  Sun,
  Heart,
  ChevronRight,
  CheckCircle2,
  Star
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = ({ onOpenQuiz }) => {
  const [highlights, setHighlights] = useState({ featured: [], bestSellers: [], newArrivals: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSkinTab, setActiveSkinTab] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highlightsRes, categoriesRes] = await Promise.all([
          api.get('/products/home/highlights'),
          api.get('/categories')
        ]);
        if (highlightsRes.data.success) {
          setHighlights(highlightsRes.data);
        }
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const skinTabs = ['All', 'Oily', 'Dry', 'Combination', 'Sensitive'];
  const filteredBestSellers = activeSkinTab === 'All'
    ? highlights.bestSellers
    : highlights.bestSellers.filter(p => p.skinTypes?.includes(activeSkinTab) || p.skinTypes?.includes('All Skin Types'));

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-linear-to-b from-[#F2ECE4] via-[#FBF9F5] to-[#FAF8F5]">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#E28D76]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#3D6B58]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200/90 shadow-2xs text-xs font-semibold text-[#3D6B58]">
                <Sparkles className="w-4 h-4 text-[#3D6B58]" />
                <span>Science-Backed Dermatological Formulations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.12] tracking-tight">
                Restore your barrier. <br />
                <span className="italic font-normal text-[#3D6B58]">Reveal your authentic</span> glow.
              </h1>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Formulated with lipid-identical ceramides, ultra-stable lipid Vitamin C, and soothing centella hydrosols. Clinically proven to hydrate, repair, and brighten without irritation.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs sm:text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Explore Skincare Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={onOpenQuiz}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#D97762]" />
                  <span>Take Skincare Diagnostic</span>
                </button>
              </div>

              {/* Trust badges strip */}
              <div className="pt-8 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-stone-900">100%</p>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Clean & Vegan</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-stone-900">72-Hour</p>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Deep Moisture Lock</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-stone-900">98.4%</p>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Barrier Repair Rate</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Product Feature Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"
                    alt="Radiance C-Complex 15% Glow Serum"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                      Award Winning Hero Formula
                    </span>
                    <h3 className="text-lg font-serif font-bold">Radiance C-Complex 15% Glow Serum</h3>
                    <p className="text-xs text-stone-200">15% THD Vitamin C + Ferulic Acid + Plum Extract</p>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Derm Approved</span>
                    <span className="text-[10px] text-stone-500">Non-comedogenic tested</span>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="avatar" />
                  </div>
                  <div>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800">4.9/5 from 4,800+ reviews</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D6B58]">
              Targeted Skincare Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Shop by Formulation
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#3D6B58] hover:underline flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 bg-stone-100 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#3D6B58] transition">
                {cat.name}
              </h3>
              <span className="text-[10px] text-stone-400 mt-0.5">
                {cat.productCount ? `${cat.productCount} Items` : 'Explore'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS & SKIN TYPE FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3D6B58]">
              Most Loved Formulations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Bestsellers Loved by Over 50k Skins
            </h2>
          </div>

          {/* Skin Type Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-full">
            {skinTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSkinTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeSkinTab === tab
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab === 'All' ? 'All Skin Types' : `${tab} Skin`}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBestSellers.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-semibold rounded-full transition shadow-xs"
          >
            <span>Explore All {highlights.bestSellers.length + highlights.featured.length}+ Formulations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* INTERACTIVE ROUTINE DIAGNOSTIC BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-linear-to-r from-[#2F5243] to-[#1E372B] text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#85B09A]/15 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Routine Matching</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              Not sure which actives your skin needs?
            </h2>

            <p className="text-stone-300 text-sm sm:text-base mt-4 leading-relaxed">
              Take our 60-second Skincare Diagnostic. Our algorithm analyzes your skin type, hydration levels, and sensitivity profile to design a custom 5-step regimen with 15% bundle savings.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={onOpenQuiz}
                className="px-7 py-3.5 bg-white hover:bg-stone-100 text-stone-900 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition shadow-lg active:scale-95"
              >
                <span>Start Skincare Quiz</span>
                <Sparkles className="w-4 h-4 text-[#3D6B58]" />
              </button>
              <span className="text-xs text-stone-300 font-medium">
                Over 12,000 regimens tailored this month
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN INGREDIENT STANDARDS / BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D6B58]">
            The GlowCare Standard
          </span>
          <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Science in every dropper. Integrity in every bottle.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            We exclude over 1,800 suspicious synthetic ingredients while prioritizing biocompatible actives in clinically proven concentrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#3D6B58] flex items-center justify-center mb-6">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">100% Vegan & Leaping Bunny Certified</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero animal derivatives, zero testing on animals at any stage. Packaged with FSC-certified cartons and recyclable amber glass.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Lipid-Identical Bio-Ceramides</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Formulated at the optimal 3:1:1 lipid ratio (Ceramides : Cholesterol : Fatty Acids) to mimic natural healthy sebum and lock in moisture.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#D97762] flex items-center justify-center mb-6">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Invisible Non-Nano Sun Protection</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sheer mineral zinc oxide technology delivers reef-safe broad-spectrum UVA & UVB defense with zero ghosting on all skin tones.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
