import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../lib/api';
import type { Category } from '../types';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>({ name: '', slug: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { loadCategories(); }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCategories = async () => {
    setIsLoading(true);
    const { data } = await api.categories.list();
    setCategories(data || []);
    setIsLoading(false);
  };

  const openCreate = () => {
    setEditingCat(null);
    setForm({ name: '', slug: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      showToast('Name and slug are required.', 'error');
      return;
    }
    setSaving(true);
    const payload = { name: form.name.trim(), slug: form.slug.trim(), description: form.description.trim() };

    if (editingCat) {
      const { error } = await api.categories.update(editingCat.id, payload);
      if (error) showToast(error.message, 'error');
      else showToast('Category updated!');
    } else {
      const { error } = await api.categories.create(payload);
      if (error) showToast(error.message, 'error');
      else showToast('Category created!');
    }
    setSaving(false);
    setModalOpen(false);
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    const { error } = await api.categories.delete(id);
    if (error) showToast(error.message, 'error');
    else showToast('Category deleted.');
    setDeleteConfirm(null);
    loadCategories();
  };

  return (
    <div className="space-y-4 relative">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-[#B0A0B0] text-sm gap-2">
            <svg className="animate-spin w-4 h-4 text-[#FFB3D1]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-[#B0A0B0] text-sm">No categories yet. Add one!</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FFF8F0] border-b border-[#FFB3D1]/15">
                <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold">Name</th>
                <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold hidden sm:table-cell">Slug</th>
                <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold hidden md:table-cell">Description</th>
                <th className="text-right px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFB3D1]/10">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#FFF8F0] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#3D2B3D]">{cat.name}</td>
                  <td className="px-6 py-4 font-mono text-[#B0A0B0] text-xs hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-6 py-4 text-[#7A6A7A] text-xs hidden md:table-cell max-w-xs truncate">{cat.description || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="p-2 hover:bg-[#FFCCE0]/50 text-[#7A6A7A] hover:text-[#FFB3D1] rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteConfirm === cat.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(cat.id)} className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(cat.id)} className="p-2 hover:bg-red-50 text-[#7A6A7A] hover:text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#FFB3D1]/20 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#FFB3D1]/15 bg-[#FFF8F0]">
              <h2 className="font-serif text-xl text-[#3D2B3D]">{editingCat ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-[#FFCCE0] rounded-xl transition-colors">
                <X className="w-4 h-4 text-[#FFB3D1]" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  placeholder="Category name"
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="category-slug"
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] font-mono placeholder:text-[#C0B0C0]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description…"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] resize-none placeholder:text-[#C0B0C0]"
                />
              </div>
            </div>
            <div className="px-8 py-5 border-t border-[#FFB3D1]/15 bg-[#FFF8F0] flex items-center justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 border border-[#FFB3D1]/30 text-[#7A6A7A] rounded-xl hover:border-[#FFB3D1] transition-colors text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium disabled:opacity-70">
                {saving ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
