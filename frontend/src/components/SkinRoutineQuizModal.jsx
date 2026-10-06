import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RefreshCw, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const SKIN_TYPES = [
  { id: 'Oily', label: 'Oily Skin', desc: 'Prone to midday shine, larger pores, and frequent congestion.' },
  { id: 'Dry', label: 'Dry Skin', desc: 'Feels tight after cleansing, prone to flakiness, craves rich moisture.' },
  { id: 'Combination', label: 'Combination', desc: 'Oily forehead and nose T-zone with balanced or dry cheeks.' },
  { id: 'Sensitive', label: 'Sensitive Skin', desc: 'Easily turns red, stings with perfumes, reactive barrier.' },
  { id: 'Normal', label: 'Normal / Balanced', desc: 'Rarely breaks out, even texture and comfortable hydration.' }
];

const CONCERNS = [
  { id: 'Acne & Blemishes', label: 'Clear Breakouts & Pores', icon: '✨' },
  { id: 'Hydration & Dryness', label: 'Deep Barrier Hydration', icon: '💧' },
  { id: 'Brightening & Dullness', label: 'Glow & Fade Dark Spots', icon: '☀️' },
  { id: 'Anti-Aging', label: 'Firming & Fine Lines', icon: '🌿' },
  { id: 'Redness & Sensitivity', label: 'Calm Redness & Irritation', icon: '🌸' }
];

const SkinRoutineQuizModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState('Combination');
  const [selectedConcern, setSelectedConcern] = useState('Hydration & Dryness');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const { addToCart, setIsCartOpen } = useCart();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleFetchRoutine = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products/routine-finder', {
        params: {
          skinType: selectedSkinType,
          concern: selectedConcern
        }
      });
      if (res.data.success) {
        setRecommendation(res.data);
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      addToast('Could not load routine recommendation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (!recommendation?.routine) return;
    recommendation.routine.forEach((item) => {
      if (item.product) {
        addToCart(item.product, 1);
      }
    });
    addToast('Added complete personalized routine to your bag!', 'success');
    onClose();
    setIsCartOpen(true);
  };

  const handleReset = () => {
    setStep(1);
    setRecommendation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF8F5] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 z-10 p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
          aria-label="Close Quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1ED] text-[#3D6B58] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Skincare Routine Diagnostic</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
            Find Your Perfect Skincare Match
          </h2>
          <p className="text-xs md:text-sm text-stone-600 mt-1">
            Answer 2 quick questions to get a science-backed, dermatologist approved 5-step daily routine.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-10 bg-[#3D6B58]' : 'w-4 bg-stone-300'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-10 bg-[#3D6B58]' : 'w-4 bg-stone-300'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-10 bg-[#3D6B58]' : 'w-4 bg-stone-300'}`} />
        </div>

        {/* STEP 1: Skin Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-stone-900 text-center">
              Step 1: How does your skin feel midday?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {SKIN_TYPES.map((type) => {
                const isSelected = selectedSkinType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedSkinType(type.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#3D6B58] bg-[#F3F7F4] ring-1 ring-[#3D6B58]'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-stone-900 text-sm">{type.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#3D6B58]" />}
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">{type.desc}</p>
                  </button>
                );
              })}
            </div>
            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-stone-900 hover:bg-[#3D6B58] text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Concern */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-stone-900 text-center">
              Step 2: What is your primary skin goal right now?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {CONCERNS.map((c) => {
                const isSelected = selectedConcern === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConcern(c.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#3D6B58] bg-[#F3F7F4] ring-1 ring-[#3D6B58]'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-stone-900 text-sm block">{c.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#3D6B58]" />}
                  </button>
                );
              })}
            </div>
            <div className="pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFetchRoutine}
                disabled={loading}
                className="px-6 py-3 bg-[#3D6B58] hover:bg-[#2F5243] text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition shadow-xs"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing formula synergy...</span>
                  </>
                ) : (
                  <>
                    <span>Reveal My 5-Step Routine</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && recommendation && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
                  Matched Prescription
                </span>
                <h4 className="text-base font-bold text-emerald-950 mt-0.5">
                  {recommendation.skinType} Skin • {recommendation.concern}
                </h4>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>

            {/* Matched Steps List */}
            <div className="space-y-3">
              {recommendation.routine?.map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3D6B58] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {item.step}
                  </div>
                  <img
                    src={item.product?.thumbnail}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#3D6B58] block">
                      {item.title} — {item.subtitle}
                    </span>
                    <h5 className="text-xs font-semibold text-stone-900 truncate">
                      {item.product?.name}
                    </h5>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-stone-900">
                      ${item.product?.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Price & Add All CTA */}
            <div className="bg-stone-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-stone-400">Complete 5-Piece System Special</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-white">
                    ${recommendation.discountedPrice}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    ${recommendation.bundlePrice}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md">
                    Save 15% Bundle
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddAllToCart}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-[#3D6B58]" />
                <span>Add Complete Routine to Bag</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinRoutineQuizModal;
