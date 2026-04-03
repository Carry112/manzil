// src/lib/api.ts
// Drop-in replacement for supabase client calls — hits local Express API

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: new Error(json.error || res.statusText) };
    return { data: json.data as T, error: null };
  } catch (e) {
    return { data: null, error: e as Error };
  }
}

// ── Categories ────────────────────────────────────────────────────────────────
export const api = {
  categories: {
    list:   ()                         => request<any[]>('/categories'),
    create: (body: object)             => request<any>('/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string)               => request<null>(`/categories/${id}`, { method: 'DELETE' }),
  },

  // ── Products ──────────────────────────────────────────────────────────────
  products: {
    list:       (params: Record<string, string | boolean | number> = {}) => {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
      ).toString();
      return request<any[]>(`/products${qs ? '?' + qs : ''}`);
    },
    bySlug:     (slug: string)         => request<any[]>(`/products?slug=${encodeURIComponent(slug)}`),
    create:     (body: object)         => request<any>('/products', { method: 'POST', body: JSON.stringify(body) }),
    update:     (id: string, body: object) => request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete:     (id: string)           => request<null>(`/products/${id}`, { method: 'DELETE' }),
  },

  // ── Cart ──────────────────────────────────────────────────────────────────
  cart: {
    list:        (sessionId: string)   => request<any[]>(`/cart?session_id=${sessionId}`),
    add:         (body: object)        => request<any>('/cart', { method: 'POST', body: JSON.stringify(body) }),
    updateQty:   (id: string, quantity: number) =>
                                          request<any>(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    remove:      (id: string)          => request<null>(`/cart/${id}`, { method: 'DELETE' }),
    clearSession:(sessionId: string)   => request<null>(`/cart/session/${sessionId}`, { method: 'DELETE' }),
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  orders: {
    list:        (params: Record<string, string | number> = {}) => {
      const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))).toString();
      return request<any[]>(`/orders${qs ? '?' + qs : ''}`);
    },
    create:      (body: object)        => request<any>('/orders', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus:(id: string, status: string) =>
                                          request<any>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },

  // ── FAQ (public + admin) ────────────────────────────────────────────────
  faqs: {
    listPublic: () => request<{ categories: any[]; items: any[] }>('/faqs'),
    listAdmin: (params: Record<string, string> = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request<any[]>(`/admin/faqs${qs ? '?' + qs : ''}`);
    },
    create: (body: object) => request<any>('/admin/faqs', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) => request<any>(`/admin/faqs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<null>(`/admin/faqs/${id}`, { method: 'DELETE' }),
  },

  faqCategories: {
    list: () => request<any[]>('/admin/faq-categories'),
    create: (body: object) => request<any>('/admin/faq-categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: object) => request<any>(`/admin/faq-categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<null>(`/admin/faq-categories/${id}`, { method: 'DELETE' }),
  },

  // ── Stats (admin) ─────────────────────────────────────────────────────────
  stats: {
    get: () => request<{ totalProducts: number; totalOrders: number; totalRevenue: number; totalCategories: number }>('/stats'),
  },
};
