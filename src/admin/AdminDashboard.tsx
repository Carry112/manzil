import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Tag, TrendingUp, DollarSign, ArrowUp, Clock } from 'lucide-react';
import { api } from '../lib/api';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: {
    id: string;
    email: string;
    total: number;
    status: string;
    created_at: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    const [{ data: statsData }, { data: recentData }] = await Promise.all([
      api.stats.get(),
      api.orders.list({ limit: 6 }),
    ]);
    const s = statsData as any;
    setStats({
      totalProducts:   s?.totalProducts   || 0,
      totalOrders:     s?.totalOrders     || 0,
      totalCategories: s?.totalCategories || 0,
      totalRevenue:    s?.totalRevenue    || 0,
      pendingOrders:   0,
      recentOrders:    (recentData as any[]) || [],
    });
    setIsLoading(false);
  };

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-[#FFB3D1] to-[#FFCCE0]',
      iconColor: 'text-[#FFB3D1]',
      bg: 'bg-[#FFCCE0]/20',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-[#A8C4FF] to-[#C8DCFF]',
      iconColor: 'text-[#A8C4FF]',
      bg: 'bg-[#C8DCFF]/20',
    },
    {
      label: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: 'from-[#D4B3FF] to-[#E8D5FF]',
      iconColor: 'text-[#C491FF]',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-[#B3FFD4] to-[#D5FFE8]',
      iconColor: 'text-[#3DAA6A]',
      bg: 'bg-green-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[#7A6A7A]">
          <svg className="animate-spin w-5 h-5 text-[#FFB3D1]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, iconColor, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-[#FFB3D1]/15 p-6 hover:shadow-lg hover:shadow-[#FFB3D1]/10 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#B0A0B0] font-semibold mb-2">{label}</p>
                <p className="font-serif text-3xl text-[#3D2B3D] font-bold">{value}</p>
              </div>
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>Live data</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending orders alert */}
      {stats.pendingOrders > 0 && (
        <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>{stats.pendingOrders} pending {stats.pendingOrders === 1 ? 'order' : 'orders'}</strong> waiting to be processed.
          </p>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#FFB3D1]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FFB3D1]" />
            <h2 className="font-serif text-lg text-[#3D2B3D]">Recent Orders</h2>
          </div>
          <span className="text-xs text-[#B0A0B0]">Last 6 orders</span>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center text-[#B0A0B0] text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-[#FFB3D1]/10">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#FFF8F0] transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#3D2B3D]">{order.email}</p>
                    <p className="text-xs text-[#B0A0B0] font-mono mt-0.5">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                  <span className="font-mono text-sm font-semibold text-[#3D2B3D]">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
