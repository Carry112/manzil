import { LogOut, CreditCard as Edit2, Package, Settings } from 'lucide-react';
import { useState } from 'react';

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-md mx-auto px-6">
          <h1 className="font-serif text-4xl text-[#2D3142] mb-8 text-center">Welcome to Chelouve</h1>

          <div className="card-soft p-8 mb-6">
            <h2 className="font-bold text-[#2D3142] text-lg mb-6 text-center">Sign In</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoggedIn(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-[#2D3142] mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2D3142] mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white rounded-lg hover:shadow-lg transition-all font-bold"
              >
                Sign In
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FFB6D9]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#6B7280]">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3 border-2 border-[#FFB6D9] text-[#FF69B4] rounded-lg hover:bg-[#FFE4F5] transition-colors font-bold"
            >
              Create Account
            </button>
          </div>

          <p className="text-center text-[#6B7280] text-sm">
            Browse as guest or <a href="/shop" className="text-[#FF69B4] hover:underline">continue shopping</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-serif text-5xl text-[#2D3142]">My Account</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 px-6 py-3 text-[#FF69B4] border border-[#FFB6D9] rounded-lg hover:bg-[#FFE4F5] transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="card-soft p-6 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-[#FF69B4]/20 to-[#87CEEB]/20 text-[#FF69B4]'
                    : 'text-[#6B7280] hover:text-[#FF69B4]'
                }`}
              >
                <Edit2 className="w-4 h-4 inline mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#FF69B4]/20 to-[#87CEEB]/20 text-[#FF69B4]'
                    : 'text-[#6B7280] hover:text-[#FF69B4]'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-[#FF69B4]/20 to-[#87CEEB]/20 text-[#FF69B4]'
                    : 'text-[#6B7280] hover:text-[#FF69B4]'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="card-soft p-8">
                <h2 className="font-serif text-2xl text-[#2D3142] mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#2D3142] mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Sarah"
                      className="w-full px-4 py-3 border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2D3142] mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Johnson"
                      className="w-full px-4 py-3 border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#2D3142] mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="sarah@example.com"
                      className="w-full px-4 py-3 border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#2D3142] mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 987-6543"
                      className="w-full px-4 py-3 border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
                    />
                  </div>
                </div>
                <button className="mt-6 px-8 py-3 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white rounded-lg hover:shadow-lg transition-all font-bold">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="card-soft p-8">
                <h2 className="font-serif text-2xl text-[#2D3142] mb-6">Order History</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="p-4 border border-[#FFB6D9]/30 rounded-lg hover:bg-[#FFE4F5]/20 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#2D3142]">Order #{12345 + order}</p>
                          <p className="text-sm text-[#6B7280]">March {15 - order}, 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#FF69B4]">${189 + order * 50}</p>
                          <span className="inline-block mt-1 px-3 py-1 bg-[#D4F0F8] text-[#87CEEB] text-xs rounded-full">
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card-soft p-8">
                <h2 className="font-serif text-2xl text-[#2D3142] mb-6">Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2D3142]">Email Notifications</p>
                      <p className="text-sm text-[#6B7280]">Receive updates about orders and promotions</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FF69B4]" />
                  </div>
                  <div className="border-t border-[#FFB6D9]/30 pt-6 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2D3142]">Marketing Emails</p>
                      <p className="text-sm text-[#6B7280]">Get exclusive offers and new collection announcements</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#FF69B4]" />
                  </div>
                  <div className="border-t border-[#FFB6D9]/30 pt-6">
                    <button className="text-[#FF69B4] hover:text-[#87CEEB] transition-colors font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
