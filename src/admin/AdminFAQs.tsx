import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { api } from '../lib/api';
import type { FAQCategory, FAQItem } from '../types';

interface CategoryFormData {
  name: string;
  slug: string;
  sort_order: string;
  is_active: boolean;
}

interface FAQFormData {
  category_id: string;
  question: string;
  answer: string;
  sort_order: string;
  is_active: boolean;
}

const EMPTY_CATEGORY_FORM: CategoryFormData = {
  name: '',
  slug: '',
  sort_order: '0',
  is_active: true,
};

const EMPTY_FAQ_FORM: FAQFormData = {
  category_id: '',
  question: '',
  answer: '',
  sort_order: '0',
  is_active: true,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AdminFAQs() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>(EMPTY_CATEGORY_FORM);
  const [faqForm, setFaqForm] = useState<FAQFormData>(EMPTY_FAQ_FORM);

  const [savingCategory, setSavingCategory] = useState(false);
  const [savingFaq, setSavingFaq] = useState(false);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);
  const [deleteFaqConfirm, setDeleteFaqConfirm] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setIsLoading(true);
    const [{ data: categoryData }, { data: faqData }] = await Promise.all([
      api.faqCategories.list(),
      api.faqs.listAdmin(),
    ]);

    setCategories((categoryData as FAQCategory[]) || []);
    setFaqs((faqData as FAQItem[]) || []);
    setIsLoading(false);
  };

  const categoriesById = useMemo(() => {
    return categories.reduce<Record<string, FAQCategory>>((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }, [categories]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || faq.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, search, categoryFilter]);

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setCategoryModalOpen(true);
  };

  const openEditCategory = (category: FAQCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      sort_order: String(category.sort_order),
      is_active: category.is_active,
    });
    setCategoryModalOpen(true);
  };

  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      ...EMPTY_FAQ_FORM,
      category_id: categories[0]?.id || '',
    });
    setFaqModalOpen(true);
  };

  const openEditFaq = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFaqForm({
      category_id: faq.category_id,
      question: faq.question,
      answer: faq.answer,
      sort_order: String(faq.sort_order),
      is_active: faq.is_active,
    });
    setFaqModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim() || !categoryForm.slug.trim()) {
      showToast('Category name and slug are required.', 'error');
      return;
    }

    setSavingCategory(true);
    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      sort_order: Number(categoryForm.sort_order) || 0,
      is_active: categoryForm.is_active,
    };

    if (editingCategory) {
      const { error } = await api.faqCategories.update(editingCategory.id, payload);
      if (error) showToast(error.message, 'error');
      else showToast('FAQ category updated.');
    } else {
      const { error } = await api.faqCategories.create(payload);
      if (error) showToast(error.message, 'error');
      else showToast('FAQ category created.');
    }

    setSavingCategory(false);
    setCategoryModalOpen(false);
    await loadData();
  };

  const handleSaveFaq = async () => {
    if (!faqForm.category_id || !faqForm.question.trim() || !faqForm.answer.trim()) {
      showToast('Category, question, and answer are required.', 'error');
      return;
    }

    setSavingFaq(true);
    const payload = {
      category_id: faqForm.category_id,
      question: faqForm.question.trim(),
      answer: faqForm.answer.trim(),
      sort_order: Number(faqForm.sort_order) || 0,
      is_active: faqForm.is_active,
    };

    if (editingFaq) {
      const { error } = await api.faqs.update(editingFaq.id, payload);
      if (error) showToast(error.message, 'error');
      else showToast('FAQ updated.');
    } else {
      const { error } = await api.faqs.create(payload);
      if (error) showToast(error.message, 'error');
      else showToast('FAQ created.');
    }

    setSavingFaq(false);
    setFaqModalOpen(false);
    await loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await api.faqCategories.delete(id);
    if (error) showToast(error.message, 'error');
    else showToast('FAQ category deleted.');
    setDeleteCategoryConfirm(null);
    await loadData();
  };

  const handleDeleteFaq = async (id: string) => {
    const { error } = await api.faqs.delete(id);
    if (error) showToast(error.message, 'error');
    else showToast('FAQ deleted.');
    setDeleteFaqConfirm(null);
    await loadData();
  };

  return (
    <div className="space-y-4 relative">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFB3D1]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQ questions..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            onClick={openCreateCategory}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#A8C4FF]/45 text-[#3D2B3D] rounded-xl text-sm font-medium hover:border-[#6FA3FF] hover:text-[#6FA3FF] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>

          <button
            onClick={openCreateFaq}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#FFB3D1]/15 bg-[#FFF8F0]">
            <h2 className="font-serif text-lg text-[#3D2B3D]">FAQ Categories</h2>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-[#B0A0B0] text-sm">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center text-[#B0A0B0] text-sm">No FAQ categories yet.</div>
          ) : (
            <div className="divide-y divide-[#FFB3D1]/10">
              {categories.map((category) => (
                <div key={category.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#3D2B3D]">{category.name}</p>
                    <p className="text-xs text-[#A695A6] font-mono">{category.slug}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wider ${
                        category.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.is_active ? 'Active' : 'Hidden'}
                    </span>
                    <button
                      onClick={() => openEditCategory(category)}
                      className="p-2 hover:bg-[#FFCCE0]/50 text-[#7A6A7A] hover:text-[#FFB3D1] rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {deleteCategoryConfirm === category.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteCategoryConfirm(null)}
                          className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteCategoryConfirm(category.id)}
                        className="p-2 hover:bg-red-50 text-[#7A6A7A] hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#FFB3D1]/15 bg-[#FFF8F0]">
            <h2 className="font-serif text-lg text-[#3D2B3D]">FAQ Questions</h2>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-[#B0A0B0] text-sm">Loading FAQs...</div>
          ) : filteredFaqs.length === 0 ? (
            <div className="py-16 text-center text-[#B0A0B0] text-sm">No FAQ entries found.</div>
          ) : (
            <div className="divide-y divide-[#FFB3D1]/10 max-h-[640px] overflow-y-auto">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#3D2B3D] truncate">{faq.question}</p>
                      <p className="mt-1 text-xs text-[#9F8E9F] line-clamp-2">{faq.answer}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider">
                        <span className="rounded-full bg-[#F5EDF5] px-2 py-1 text-[#8E7E8E]">
                          {categoriesById[faq.category_id]?.name || faq.category_name || 'Uncategorized'}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 font-medium ${
                            faq.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {faq.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditFaq(faq)}
                        className="p-2 hover:bg-[#FFCCE0]/50 text-[#7A6A7A] hover:text-[#FFB3D1] rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteFaqConfirm === faq.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteFaqConfirm(null)}
                            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteFaqConfirm(faq.id)}
                          className="p-2 hover:bg-red-50 text-[#7A6A7A] hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm" onClick={() => setCategoryModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#FFB3D1]/20 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#FFB3D1]/15 bg-[#FFF8F0]">
              <h2 className="font-serif text-xl text-[#3D2B3D]">
                {editingCategory ? 'Edit FAQ Category' : 'New FAQ Category'}
              </h2>
              <button onClick={() => setCategoryModalOpen(false)} className="p-2 hover:bg-[#FFCCE0] rounded-xl transition-colors">
                <X className="w-4 h-4 text-[#FFB3D1]" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Name *</label>
                <input
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                  placeholder="Shipping & Orders"
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Slug *</label>
                <input
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="shipping-orders"
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Sort Order</label>
                  <input
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D]"
                  />
                </div>

                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-[#3D2B3D]">
                    <input
                      type="checkbox"
                      checked={categoryForm.is_active}
                      onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                      className="h-4 w-4 rounded border-[#FFB3D1]/40"
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-[#FFB3D1]/15 bg-[#FFF8F0] flex items-center justify-end gap-3">
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="px-6 py-2.5 border border-[#FFB3D1]/30 text-[#7A6A7A] rounded-xl hover:border-[#FFB3D1] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={savingCategory}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {savingCategory ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm" onClick={() => setFaqModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#FFB3D1]/20 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#FFB3D1]/15 bg-[#FFF8F0]">
              <h2 className="font-serif text-xl text-[#3D2B3D]">{editingFaq ? 'Edit FAQ' : 'New FAQ'}</h2>
              <button onClick={() => setFaqModalOpen(false)} className="p-2 hover:bg-[#FFCCE0] rounded-xl transition-colors">
                <X className="w-4 h-4 text-[#FFB3D1]" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Category *</label>
                <select
                  value={faqForm.category_id}
                  onChange={(e) => setFaqForm({ ...faqForm, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D]"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Question *</label>
                <textarea
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  rows={2}
                  placeholder="Do you ship internationally?"
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Answer *</label>
                <textarea
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  rows={5}
                  placeholder="Yes, we ship worldwide..."
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">Sort Order</label>
                  <input
                    type="number"
                    value={faqForm.sort_order}
                    onChange={(e) => setFaqForm({ ...faqForm, sort_order: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D]"
                  />
                </div>

                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-[#3D2B3D]">
                    <input
                      type="checkbox"
                      checked={faqForm.is_active}
                      onChange={(e) => setFaqForm({ ...faqForm, is_active: e.target.checked })}
                      className="h-4 w-4 rounded border-[#FFB3D1]/40"
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-[#FFB3D1]/15 bg-[#FFF8F0] flex items-center justify-end gap-3">
              <button
                onClick={() => setFaqModalOpen(false)}
                className="px-6 py-2.5 border border-[#FFB3D1]/30 text-[#7A6A7A] rounded-xl hover:border-[#FFB3D1] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFaq}
                disabled={savingFaq}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {savingFaq ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
