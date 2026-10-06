import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('glowcare_token') || null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/profile');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Failed to load profile with existing token:', err);
        localStorage.removeItem('glowcare_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('glowcare_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        addToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, skinType, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, skinType, phone });
      if (res.data.success) {
        localStorage.setItem('glowcare_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        addToast(`Welcome to GlowCare, ${res.data.user.name}!`, 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('glowcare_token');
    setToken(null);
    setUser(null);
    addToast('You have been signed out successfully.', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, ...res.data.user }));
        addToast('Profile updated successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update profile.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      addToast('Please sign in to save products to your wishlist.', 'info');
      return false;
    }
    try {
      const res = await api.post(`/auth/wishlist/${productId}`);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, wishlist: res.data.wishlist }));
        addToast(res.data.message, 'success');
        return res.data.isWishlisted;
      }
    } catch (err) {
      addToast('Error updating wishlist', 'error');
      return false;
    }
  };

  const isWishlisted = (productId) => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some((item) => (typeof item === 'string' ? item === productId : item._id === productId));
  };

  const addAddress = async (addressData) => {
    try {
      const res = await api.post('/auth/address', addressData);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
        addToast('Address saved successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not save address.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await api.delete(`/auth/address/${addressId}`);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
        addToast('Address removed.', 'info');
        return { success: true };
      }
    } catch (err) {
      addToast('Failed to delete address.', 'error');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
        isWishlisted,
        addAddress,
        deleteAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
