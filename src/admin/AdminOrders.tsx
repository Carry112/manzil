import { useEffect, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { api } from '../lib/api';
import type { Order } from '../types';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped:    'bg-purple-100 text-purple-700 border-purple-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
};

interface OrderWithItems extends Order {
  order_items?: {
    id: string;
    product_name: string;
    quantity: number;
    size: string;
    price: number;
  }[];
}

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { loadOrders(); }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    setIsLoading(true);
    const { data } = await api.orders.list();
    setOrders((data as OrderWithItems[]) || []);
    setIsLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    const { error } = await api.orders.updateStatus(orderId, newStatus);
    if (error) showToast(error.message, 'error');
    else {
      showToast(`Order marked as ${newStatus}`);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    }
    setUpdatingStatus(null);
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 relative">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFB3D1]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or order ID…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pr-8 pl-4 py-2.5 bg-white border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] appearance-none"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0A0B0] pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-[#B0A0B0] text-sm gap-2">
            <svg className="animate-spin w-4 h-4 text-[#FFB3D1]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#B0A0B0] text-sm">No orders found.</div>
        ) : (
          <div className="divide-y divide-[#FFB3D1]/10">
            {filtered.map((order) => (
              <div key={order.id}>
                <div
                  className="px-6 py-4 flex items-center justify-between hover:bg-[#FFF8F0] transition-colors cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#3D2B3D]">{order.email}</p>
                      <p className="text-xs text-[#B0A0B0] font-mono mt-0.5">
                        #{order.id.slice(0, 12).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Status selector */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium appearance-none pr-7 cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'} disabled:opacity-60`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-[#3D2B3D] hidden sm:block">
                      ${Number(order.total).toFixed(2)}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#B0A0B0] transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedOrder === order.id && (
                  <div className="px-6 pb-5 bg-[#FFF8F0] border-t border-[#FFB3D1]/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#B0A0B0] font-semibold mb-2">Shipping Info</p>
                        {order.shipping_info ? (
                          <div className="text-sm text-[#3D2B3D] space-y-1">
                            {Object.entries(order.shipping_info).map(([k, v]) => (
                              <p key={k} className="flex gap-2">
                                <span className="text-[#B0A0B0] capitalize w-20 flex-shrink-0">{k}:</span>
                                <span>{String(v)}</span>
                              </p>
                            ))}
                          </div>
                        ) : <p className="text-sm text-[#B0A0B0]">No shipping info</p>}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#B0A0B0] font-semibold mb-2">Order Items</p>
                        <div className="space-y-2">
                          {(order.order_items || []).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div>
                                <span className="text-[#3D2B3D] font-medium">{item.product_name}</span>
                                <span className="text-[#B0A0B0] text-xs ml-2">× {item.quantity} · Size {item.size}</span>
                              </div>
                              <span className="font-mono text-[#3D2B3D]">${Number(item.price).toFixed(2)}</span>
                            </div>
                          ))}
                          {(!order.order_items || order.order_items.length === 0) && (
                            <p className="text-sm text-[#B0A0B0]">No items</p>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#FFB3D1]/20 flex justify-between font-semibold text-sm">
                          <span className="text-[#7A6A7A]">Total</span>
                          <span className="font-mono text-[#3D2B3D]">${Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
