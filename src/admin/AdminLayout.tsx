import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

type AdminSection = 'dashboard' | 'products' | 'categories' | 'faqs' | 'orders' | 'accounts';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
}

const navItems: { id: AdminSection; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'accounts', label: 'Accounts', icon: Users },
];

export function AdminLayout({ children, activeSection, onSectionChange, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#FFB3D1]/20 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-[#FFB3D1]/20 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#FFB3D1]/20 to-[#C8DCFF]/20 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-xl text-[#1A1A1A] font-medium tracking-[0.4em] uppercase" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                CHÉLOUVE
              </h2>
              <p className="text-[10px] text-[#B0A0B0] uppercase tracking-[0.2em] mt-0.5">Admin CMS</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-[#FFCCE0] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[#FFB3D1]" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onSectionChange(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                activeSection === id
                  ? 'bg-gradient-to-r from-[#FFB3D1]/20 to-[#C8DCFF]/20 text-[#3D2B3D] border border-[#FFB3D1]/30'
                  : 'text-[#7A6A7A] hover:bg-[#FFF8F0] hover:text-[#3D2B3D]'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  activeSection === id ? 'text-[#FFB3D1]' : 'text-[#B0A0B0] group-hover:text-[#FFB3D1]'
                }`}
              />
              <span className="flex-1 text-left">{label}</span>
              {activeSection === id && <ChevronRight className="w-3.5 h-3.5 text-[#FFB3D1]" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#FFB3D1]/20">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB3D1] to-[#A8C4FF] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div>
              <p className="text-xs font-semibold text-[#3D2B3D]">Admin</p>
              <p className="text-[10px] text-[#B0A0B0]">admin@chelouve.com</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#7A6A7A] hover:bg-red-50 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#FFB3D1]/20 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-[#FFCCE0] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-[#FFB3D1]" />
          </button>
          <div>
            <h1 className="font-serif text-xl text-[#3D2B3D] capitalize">{activeSection}</h1>
            <p className="text-xs text-[#B0A0B0]">
              {navItems.find((i) => i.id === activeSection)?.label} management
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#B0A0B0] hover:text-[#FFB3D1] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#FFCCE0]/30"
            >
              View Site ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
