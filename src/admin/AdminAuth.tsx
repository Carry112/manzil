import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

// Simple local admin credentials (no Supabase auth needed)
const ADMIN_EMAIL = 'admin@chelouve.com';
const ADMIN_PASSWORD = 'admin123';

interface AdminAuthProps {
  onLogin: () => void;
}

export function AdminAuth({ onLogin }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a brief loading delay for UX
    await new Promise((r) => setTimeout(r, 700));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('chelouve_admin_auth', 'true');
      onLogin();
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#FFB3D1]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-[#C8DCFF]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#FFCCE0]/20 via-transparent to-[#C8DCFF]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo + header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB3D1] to-[#A8C4FF] shadow-lg shadow-[#FFB3D1]/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl text-[#3D2B3D] mb-1">Admin Portal</h1>
          <p className="text-sm text-[#B0A0B0]">Chelouve CMS — Sign in to continue</p>
        </div>

        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#FFB3D1]/20 shadow-xl shadow-[#FFB3D1]/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFB3D1]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chelouve.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FFF8F0] border border-[#FFB3D1]/30 rounded-xl focus:outline-none focus:border-[#FFB3D1] focus:ring-2 focus:ring-[#FFB3D1]/10 transition-all text-[#3D2B3D] placeholder:text-[#C0B0C0] text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#7A6A7A] mb-2 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8C4FF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-[#FFF8F0] border border-[#A8C4FF]/30 rounded-xl focus:outline-none focus:border-[#A8C4FF] focus:ring-2 focus:ring-[#A8C4FF]/10 transition-all text-[#3D2B3D] placeholder:text-[#C0B0C0] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0A0B0] hover:text-[#A8C4FF] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-4 bg-[#FFF8F0] rounded-xl border border-[#FFB3D1]/15">
            <p className="text-xs text-[#B0A0B0] text-center">
              <span className="text-[#7A6A7A] font-medium">Demo credentials:</span>
              <br />
              <span className="font-mono">admin@chelouve.com</span> / <span className="font-mono">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#C0B0C0] mt-6">
          © 2024 Chelouve · Admin Portal
        </p>
      </div>
    </div>
  );
}
