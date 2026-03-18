import { useEffect, useState } from 'react';
import { Search, User, ShoppingBag } from 'lucide-react';
import { api } from '../lib/api';

interface AccountRow {
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string | null;
}

export function AdminAccounts() {
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadAccounts(); }, []);

  const loadAccounts = async () => {
    setIsLoading(true);
    const { data: orders } = await api.orders.list();

    if (!orders) { setIsLoading(false); return; }

    // Group by email
    const map: Record<string, { orderCount: number; totalSpent: number; lastOrder: string | null }> = {};
    for (const o of orders) {
      if (!map[o.email]) {
        map[o.email] = { orderCount: 0, totalSpent: 0, lastOrder: null };
      }
      map[o.email].orderCount += 1;
      map[o.email].totalSpent += Number(o.total);
      if (!map[o.email].lastOrder) map[o.email].lastOrder = o.created_at;
    }

    const rows: AccountRow[] = Object.entries(map).map(([email, data]) => ({ email, ...data }));
    rows.sort((a, b) => b.totalSpent - a.totalSpent);

    setAccounts(rows);
    setIsLoading(false);
  };

  const filtered = accounts.filter((a) =>
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold mb-2">Total Customers</p>
          <p className="font-serif text-3xl text-[#3D2B3D] font-bold">{accounts.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#A8C4FF]/20 p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold mb-2">Total Orders</p>
          <p className="font-serif text-3xl text-[#3D2B3D] font-bold">
            {accounts.reduce((s, a) => s + a.orderCount, 0)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-green-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold mb-2">Total Revenue</p>
          <p className="font-serif text-3xl text-[#3D2B3D] font-bold">
            ${accounts.reduce((s, a) => s + a.totalSpent, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFB3D1]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] text-sm text-[#3D2B3D] placeholder:text-[#C0B0C0]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#FFB3D1]/15 overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-[#B0A0B0] text-sm gap-2">
            <svg className="animate-spin w-4 h-4 text-[#FFB3D1]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading accounts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#B0A0B0]">
            <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No customer accounts found.</p>
            <p className="text-xs mt-1">Customer data appears when orders are placed.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FFF8F0] border-b border-[#FFB3D1]/15">
                <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold">Customer</th>
                <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold hidden sm:table-cell">Orders</th>
                <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold">Total Spent</th>
                <th className="text-left px-6 py-3.5 text-[10px] uppercase tracking-widest text-[#B0A0B0] font-semibold hidden md:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFB3D1]/10">
              {filtered.map((account) => (
                <tr key={account.email} className="hover:bg-[#FFF8F0] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFCCE0] to-[#C8DCFF] flex items-center justify-center text-[#3D2B3D] font-bold text-sm flex-shrink-0">
                        {account.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[#3D2B3D]">{account.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="flex items-center gap-1.5 text-[#7A6A7A]">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#FFB3D1]" />
                      {account.orderCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-[#3D2B3D]">${account.totalSpent.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-[#B0A0B0] text-xs hidden md:table-cell">
                    {account.lastOrder ? new Date(account.lastOrder).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
