import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#FFCCE0]/40 via-[#FFF8F0] to-[#C8DCFF]/30 border-t border-[#FFB3D1]/30 py-16 md:py-24 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FFB3D1]/25 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#C8DCFF]/25 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-3">
            <h3 className="text-3xl text-[#1A1A1A] font-medium tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>CHÉLOUVE</h3>
            <p className="text-[#7A6A7A] leading-relaxed max-w-sm text-sm">
              Every step tells a story. Discover handcrafted footwear designed for your unique journey.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB3D1] to-[#FFCCE0] flex items-center justify-center text-white hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A8C4FF] to-[#C8DCFF] flex items-center justify-center text-white hover:shadow-lg hover:shadow-[#A8C4FF]/30 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#3D2B3D] mb-6 uppercase text-sm tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/shop" className="text-[#7A6A7A] hover:text-[#FFB3D1] transition-colors">All Products</a></li>
              <li><a href="/shop" className="text-[#7A6A7A] hover:text-[#FFB3D1] transition-colors">New Arrivals</a></li>
              <li><a href="/shop" className="text-[#7A6A7A] hover:text-[#FFB3D1] transition-colors">Featured</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#3D2B3D] mb-6 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="text-[#7A6A7A] hover:text-[#FFB3D1] transition-colors">About Us</a></li>
              <li><a href="/blog" className="text-[#7A6A7A] hover:text-[#FFB3D1] transition-colors">Stories</a></li>
              <li><a href="/contact" className="text-[#7A6A7A] hover:text-[#FFB3D1] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#3D2B3D] mb-6 uppercase text-sm tracking-wider">Help</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/faq" className="text-[#7A6A7A] hover:text-[#A8C4FF] transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="text-[#7A6A7A] hover:text-[#A8C4FF] transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-[#7A6A7A] hover:text-[#A8C4FF] transition-colors">Returns</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-[#3D2B3D] mb-6 uppercase text-sm tracking-wider">Newsletter</h4>
            <p className="text-[#7A6A7A] text-sm mb-4">Get exclusive updates on new collections and stories.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/70 border border-[#FFB3D1]/40 rounded-xl focus:outline-none focus:border-[#FFB3D1] transition-colors text-sm placeholder:text-[#B0A0B0]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all text-sm font-medium flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#FFB3D1]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#B0A0B0]">
          <p>© 2024 Chelouve. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="/privacy" className="hover:text-[#FFB3D1] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#FFB3D1] transition-colors">Terms of Service</a>
            <a href="/shipping" className="hover:text-[#A8C4FF] transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
