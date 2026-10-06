import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      if (res.user?.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@glowcare.com');
      setPassword('admin123');
    } else {
      setEmail('user@glowcare.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#3D6B58] text-white flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Welcome to GlowCare
          </h1>
          <p className="text-xs text-stone-500">
            Sign in to access your routine orders, wishlist, and recommendations.
          </p>
        </div>

        {/* 1-Click Demo Credential Buttons for Testing */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200 text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
            Instant One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="py-1.5 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold shadow-2xs transition"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold shadow-2xs transition"
            >
              Demo Admin Panel
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emma@example.com"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md active:scale-98"
          >
            {loading ? 'Authenticating...' : 'Sign In to GlowCare'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#3D6B58] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
