import React, { useState } from 'react';
import { User, MapPin, Key, Plus, Trash2, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const CONCERNS = [
  'Acne & Blemishes',
  'Hydration & Dryness',
  'Brightening & Dullness',
  'Anti-Aging',
  'Redness & Sensitivity',
  'Sun Protection',
  'Pores & Texture'
];

const ProfilePage = () => {
  const { user, updateProfile, addAddress, deleteAddress, logout } = useAuth();
  const { addToast } = useToast();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [skinType, setSkinType] = useState(user?.skinType || 'Combination');
  const [selectedConcerns, setSelectedConcerns] = useState(user?.skinConcerns || []);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // New Address Modal/Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostal, setNewPostal] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      name,
      phone,
      skinType,
      skinConcerns: selectedConcerns
    });
    setSavingProfile(false);
  };

  const toggleConcern = (concern) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    setChangingPass(true);
    try {
      const res = await api.put('/auth/password', { currentPassword, newPassword });
      if (res.data.success) {
        addToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      addToast(msg, 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newRecipient || !newStreet || !newCity || !newPostal) {
      addToast('Please fill all mandatory address fields', 'error');
      return;
    }
    const ok = await addAddress({
      recipientName: newRecipient,
      phone: newPhone,
      street: newStreet,
      city: newCity,
      state: newState,
      postalCode: newPostal,
      country: 'United States'
    });
    if (ok) {
      setShowAddressForm(false);
      setNewRecipient('');
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPostal('');
      setNewPhone('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">Account & Skin Profile</h1>
        <p className="text-xs text-stone-500 mt-1">Manage personal details, skin attributes, and saved shipping destinations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Personal info & Skin preferences (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <User className="w-4 h-4 text-[#3D6B58]" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Personal & Skin Diagnostics
              </h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full text-xs bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>

              {/* Skin Type Selection */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-stone-700 block mb-2">
                  Diagnosed Skin Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSkinType(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                        skinType === st
                          ? 'border-[#3D6B58] bg-[#EBF1ED] text-[#3D6B58] font-bold shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Concerns multi-select */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-stone-700 block mb-2">
                  Primary Skin Concerns
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONCERNS.map((c) => {
                    const active = selectedConcerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleConcern(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          active
                            ? 'border-[#D97762] bg-rose-50 text-[#D97762] font-semibold'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  {savingProfile ? 'Saving Changes...' : 'Update Skin Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Key className="w-4 h-4 text-[#3D6B58]" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Account Security & Password
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3D6B58]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl transition"
                >
                  {changingPass ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Address Book (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3D6B58]" />
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Saved Addresses
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-[#3D6B58] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>

            {/* Add Address Form Modal/Inline */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-3">
                <h3 className="text-xs font-bold text-stone-800">Add Delivery Location</h3>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Postal Code"
                    value={newPostal}
                    onChange={(e) => setNewPostal(e.target.value)}
                    className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#3D6B58] text-white text-xs font-bold rounded-lg"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List of addresses */}
            <div className="space-y-3">
              {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{addr.recipientName}</span>
                      <span className="text-stone-600 block mt-0.5">{addr.street}</span>
                      <span className="text-stone-600 block">{addr.city}, {addr.state} {addr.postalCode}</span>
                      {addr.phone && <span className="text-stone-400 block mt-1">{addr.phone}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr._id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 transition"
                      aria-label="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 text-center py-4">No saved addresses yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
