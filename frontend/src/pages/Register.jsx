import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [skinType, setSkinType] = useState('Combination');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(name, email, password, skinType, phone);
    setLoading(false);
    if (res?.success) {
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#3D6B58] text-white flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Create Your Account
          </h1>
          <p className="text-xs text-stone-500">
            Join GlowCare to save favorites and unlock personalized regimens.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Emma Watson"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
              />
            </div>
          </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Skin Type (For tailored suggestions)</label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3D6B58]"
            >
              {SKIN_TYPES.map((st) => (
                <option key={st} value={st}>{st} Skin</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md active:scale-98"
          >
            {loading ? 'Creating Account...' : 'Join GlowCare'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#3D6B58] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
