import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Sparkles, AlertCircle, Package } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../context/ToastContext';

const SKIN_OPTIONS = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const STEP_OPTIONS = ['Cleanse', 'Tone', 'Treat', 'Moisturize', 'Protect', 'Mask & Care'];

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: '',
    categoryName: '',
    price: '',
    compareAtPrice: '',
    stock: '50',
    volume: '50ml / 1.7 fl oz',
    thumbnail: '',
    shortDescription: '',
    description: '',
    skinTypes: ['All Skin Types'],
    routineStep: 'Treat',
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: false
  });

  const { addToast } = useToast();

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories')
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0 && !formData.category) {
          setFormData((prev) => ({
            ...prev,
            category: catRes.data.categories[0]._id,
            categoryName: catRes.data.categories[0].name
          }));
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error loading catalogue inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      subtitle: '',
      category: categories[0]?._id || '',
      categoryName: categories[0]?.name || 'Cleansers',
      price: '',
      compareAtPrice: '',
      stock: '50',
      volume: '50ml',
      thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      shortDescription: '',
      description: '',
      skinTypes: ['All Skin Types'],
      routineStep: 'Treat',
      isBestSeller: false,
      isFeatured: false,
      isNewArrival: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      subtitle: p.subtitle || '',
      category: p.category?._id || p.category,
      categoryName: p.categoryName,
      price: p.price,
      compareAtPrice: p.compareAtPrice || '',
      stock: p.stock,
      volume: p.volume || '',
      thumbnail: p.thumbnail,
      shortDescription: p.shortDescription,
      description: p.description,
      skinTypes: p.skinTypes || [],
      routineStep: p.routineStep || 'Treat',
      isBestSeller: !!p.isBestSeller,
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival
    });
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const found = categories.find((c) => c._id === catId);
    setFormData((prev) => ({
      ...prev,
      category: catId,
      categoryName: found ? found.name : ''
    }));
  };

  const handleSkinTypeToggle = (type) => {
    setFormData((prev) => {
      const exists = prev.skinTypes.includes(type);
      return {
        ...prev,
        skinTypes: exists ? prev.skinTypes.filter((t) => t !== type) : [...prev.skinTypes, type]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, formData);
        if (res.data.success) {
          addToast('Formulation updated successfully!', 'success');
          setIsModalOpen(false);
          fetchProductsAndCategories();
        }
      } else {
        const res = await api.post('/products', formData);
        if (res.data.success) {
          addToast('New skincare product added to catalogue!', 'success');
          setIsModalOpen(false);
          fetchProductsAndCategories();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product';
      addToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this formulation?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        addToast('Product removed from database', 'info');
        fetchProductsAndCategories();
      }
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  return (
    <AdminLayout title="Products & Inventory Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">Catalogue Items</h2>
            <p className="text-xs text-stone-500">Manage formulations, pricing, inventory stocks and attributes</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Formulation</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-3 border-[#3D6B58] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-stone-400">Loading products table...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Product Formulation</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Step</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block max-w-xs truncate">{p.name}</span>
                            <span className="text-[11px] text-stone-400">{p.volume} • SKU: {p.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-stone-700">{p.categoryName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF1ED] text-[#3D6B58] font-bold text-[11px]">
                          {p.routineStep}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-stone-900">${p.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.stock > 20
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.stock > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-stone-600 font-semibold">
                        ★ {p.rating} ({p.numReviews})
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Edit Formulation"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Formulation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 z-10 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Formulation' : 'Create New Formulation'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Formulation Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Squalane 100% Barrier Oil"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Subtitle / Key Actives</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Pure Botanical Lipids + Squalane"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Regimen Step</label>
                  <select
                    value={formData.routineStep}
                    onChange={(e) => setFormData({ ...formData, routineStep: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  >
                    {STEP_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Compare Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Thumbnail Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Short Summary</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence benefits overview..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Full Clinical Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">Suitable Skin Types</label>
                <div className="flex flex-wrap gap-1.5">
                  {SKIN_OPTIONS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSkinTypeToggle(st)}
                      className={`px-2.5 py-1 rounded-lg border text-xs ${
                        formData.skinTypes.includes(st)
                          ? 'border-[#3D6B58] bg-[#3D6B58] text-white'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  />
                  <span>Bestseller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured Hero</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-[#3D6B58] text-white font-bold rounded-xl"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;
