import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, HeartHandshake, Truck, RotateCcw, ArrowRight, Check } from 'lucide-react';

const Footer = ({ onOpenQuiz }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#191D24] text-stone-300 pt-16 pb-12 mt-20 border-t border-stone-800">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 text-[#85B09A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dermatologist Tested</h4>
              <p className="text-xs text-stone-400 mt-0.5">Non-comedogenic & gentle</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 text-[#85B09A] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Clean & Vegan</h4>
              <p className="text-xs text-stone-400 mt-0.5">Zero parabens or sulfates</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 text-[#85B09A] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free US Shipping $50+</h4>
              <p className="text-xs text-stone-400 mt-0.5">Fast carbon-neutral delivery</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 text-[#85B09A] flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30-Day Glow Promise</h4>
              <p className="text-xs text-stone-400 mt-0.5">Risk-free returns & refunds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3D6B58] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                GlowCare
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm">
              We bridge clinical dermatological science with high-purity botanical actives to create mindful skincare formulas that restore your skin barrier and enhance your authentic glow.
            </p>
            <div className="pt-2 text-xs text-stone-500">
              Questions? Email us at <strong className="text-stone-300">care@glowcare.com</strong>
            </div>
          </div>

          {/* Shop categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Explore Formulations</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/shop?category=cleansers" className="hover:text-white transition">Cleansers & Balms</Link></li>
              <li><Link to="/shop?category=face-wash" className="hover:text-white transition">Daily Foaming Washes</Link></li>
              <li><Link to="/shop?category=serums" className="hover:text-white transition">Vitamin C & Niacinamide</Link></li>
              <li><Link to="/shop?category=moisturizers" className="hover:text-white transition">Ceramide Barrier Creams</Link></li>
              <li><Link to="/shop?category=sunscreens" className="hover:text-white transition">Mineral SPF 50+ Sunscreens</Link></li>
              <li><Link to="/shop?category=toners" className="hover:text-white transition">Hydrating & BHA Toners</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Care & Support</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/orders" className="hover:text-white transition">Track Your Order</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">My Profile & Addresses</Link></li>
              <li><button type="button" onClick={onOpenQuiz} className="hover:text-white transition text-left">Find Routine Quiz</button></li>
              <li><Link to="/shop" className="hover:text-white transition">All Products Catalogue</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition font-medium">Admin Control Panel</Link></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Join The Glow Club</h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              Enjoy 15% off your first purchase, secret archive sales, and dermatologist skincare advice.
            </p>
            {subscribed ? (
              <div className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>You're in! Welcome to the Glow Club.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-stone-800/80 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#3D6B58]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#3D6B58] hover:bg-[#2F5243] text-white rounded-xl transition"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
        <p>© 2026 GlowCare Technologies Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Shipping & Returns</span>
          <span>Accessibility</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
