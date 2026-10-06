import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Sparkles, FolderTree } from 'lucide-react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useToast } from '../context/ToastContext';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
      addToast('Error loading categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, { name, description, image });
        if (res.data.success) {
          addToast('Category updated successfully!', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await api.post('/categories', { name, description, image });
        if (res.data.success) {
          addToast('New category created!', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save category';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        addToast('Category deleted', 'info');
        fetchCategories();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot delete category';
      addToast(msg, 'error');
    }
  };

  return (
    <AdminLayout title="Skincare Categories Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">All Product Categories</h2>
            <p className="text-xs text-stone-500">Organize formulations across cleansing, serums, moisturizers, etc.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 bg-stone-900 hover:bg-[#3D6B58] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-stone-900 text-sm truncate">{cat.name}</h3>
                  <span className="text-[11px] text-[#3D6B58] font-bold block mt-0.5">
                    {cat.productCount} Formulations
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono block">slug: {cat.slug}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {cat.description || 'No description provided.'}
              </p>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat._id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 md:p-8 z-10 space-y-5 shadow-2xl border border-stone-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eye Creams"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this product range..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-stone-900 hover:bg-[#3D6B58] text-white font-bold rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
