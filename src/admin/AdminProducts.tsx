import { useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, Search, X, Save, Star, Sparkles, ChevronDown,
} from 'lucide-react';
import { api } from '../lib/api';
import type { Product, Category } from '../types';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  category_id: string;
  images: string;
  sizes: string;
  materials: string;
  care_instructions: string;
  featured: boolean;
  new_arrival: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  category_id: '',
  images: '',
  sizes: '',
  materials: '',
  care_instructions: '',
  featured: false,
  new_arrival: false,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setIsLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      api.products.list(),
      api.categories.list(),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setIsLoading(false);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      category_id: product.category_id || '',
      images: product.images.join('\n'),
      sizes: product.sizes.join(', '),
      materials: product.materials,
      care_instructions: product.care_instructions,
      featured: product.featured,
      new_arrival: product.new_arrival,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.slug) {
      showToast('Name, slug, and price are required.', 'error');
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category_id: form.category_id || null,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: [],
      materials: form.materials.trim(),
      care_instructions: form.care_instructions.trim(),
      featured: form.featured,
      new_arrival: form.new_arrival,
    };

    if (editingProduct) {
      const { error } = await api.products.update(editingProduct.id, payload);
      if (error) { showToast(error.message, 'error'); }
      else { showToast('Product updated!'); }
    } else {
      const { error } = await api.products.create(payload);
      if (error) { showToast(error.message, 'error'); }
      else { showToast('Product created!'); }
    }

    setSaving(false);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await api.products.delete(id);
    if (error) showToast(error.message, 'error');
    else showToast('Product deleted.');
    setDeleteConfirm(null);
    loadData();
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFB3D1]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-[#B0A0B0] text-sm gap-2">
            <svg className="animate-spin w-4 h-4 text-[#FFB3D1]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#B0A0B0] text-sm">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FFF8F0] border-b border-[#FFB3D1]/15">
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold">Product</th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold">Price</th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold hidden sm:table-cell">Tags</th>
                  <th className="text-right px-5 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFB3D1]/10">
                {filtered.map((product) => {
                  const cat = categories.find((c) => c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-[#FFF8F0] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FFCCE0]/30 flex-shrink-0 overflow-hidden">
                            {product.images[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#FFB3D1] text-lg">
                                👟
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#3D2B3D]">{product.name}</p>
                            <p className="text-[#B0A0B0] text-xs font-mono">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-[#7A6A7A] text-xs">{cat?.name || '—'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono font-semibold text-[#3D2B3D]">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex gap-1.5 flex-wrap">
                          {product.featured && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#FFCCE0] text-[#D4608A] text-[10px] rounded-full font-medium">
                              <Star className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                          {product.new_arrival && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#C8DCFF] text-[#4A7AD4] text-[10px] rounded-full font-medium">
                              <Sparkles className="w-2.5 h-2.5" /> New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-2 hover:bg-[#FFCCE0]/50 text-[#7A6A7A] hover:text-[#FFB3D1] rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 hover:bg-red-50 text-[#7A6A7A] hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#FFB3D1]/20 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#FFB3D1]/15 bg-gradient-to-r from-[#FFF8F0] to-white">
              <h2 className="font-serif text-xl text-[#3D2B3D]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-[#FFCCE0] rounded-xl transition-colors">
                <X className="w-4 h-4 text-[#FFB3D1]" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-8 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    placeholder="Product name"
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="product-slug"
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] font-mono placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Price ($) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Category */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Category</label>
                  <div className="relative">
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] appearance-none"
                    >
                      <option value="">No category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A0B0] pointer-events-none" />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description…"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] resize-none placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Images */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">
                    Image URLs <span className="normal-case text-[#B0A0B0]">(one per line)</span>
                  </label>
                  <textarea
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#A8C4FF]/30 rounded-xl focus:outline-none focus:border-[#A8C4FF] text-sm text-[#3D2B3D] font-mono resize-none placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">
                    Sizes <span className="normal-case text-[#B0A0B0]">(comma-separated)</span>
                  </label>
                  <input
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    placeholder="6, 7, 8, 9, 10"
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Materials */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Materials</label>
                  <input
                    value={form.materials}
                    onChange={(e) => setForm({ ...form, materials: e.target.value })}
                    placeholder="Full-grain leather…"
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Care instructions */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Care Instructions</label>
                  <input
                    value={form.care_instructions}
                    onChange={(e) => setForm({ ...form, care_instructions: e.target.value })}
                    placeholder="Wipe clean with a damp cloth…"
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setForm({ ...form, featured: !form.featured })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-gradient-to-r from-[#FFB3D1] to-[#FFCCE0]' : 'bg-[#E0D0E0]'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? 'left-6' : 'left-1'}`} />
                    </div>
                    <span className="text-sm text-[#3D2B3D] font-medium flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#FFB3D1]" /> Featured
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setForm({ ...form, new_arrival: !form.new_arrival })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.new_arrival ? 'bg-gradient-to-r from-[#A8C4FF] to-[#C8DCFF]' : 'bg-[#E0D0E0]'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.new_arrival ? 'left-6' : 'left-1'}`} />
                    </div>
                    <span className="text-sm text-[#3D2B3D] font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#A8C4FF]" /> New Arrival
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-8 py-5 border-t border-[#FFB3D1]/15 bg-[#FFF8F0] flex items-center justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 border border-[#FFB3D1]/30 text-[#7A6A7A] rounded-xl hover:border-[#FFB3D1] hover:text-[#3D2B3D] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all text-sm font-medium disabled:opacity-70"
              >
                {saving ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving…' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
